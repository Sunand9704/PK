import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
  toggleSlideStatus,
  HeroCarouselSlide,
  CreateSlideData,
} from "../../../lib/heroCarouselApi";

export const HeroCarouselSlides: React.FC = () => {
  const [slides, setSlides] = useState<HeroCarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroCarouselSlide | null>(
    null
  );
  const [formData, setFormData] = useState<CreateSlideData>({
    title: "",
    customContent: "",
    description: "",
    image: "",
    isActive: true,
    order: 0,
    link: "",
    linkText: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch slides on component mount
  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to manage slides",
          variant: "destructive",
        });
        return;
      }
      const data = await getAllSlides(token);
      setSlides(data);
    } catch (error) {
      console.error("Error fetching slides:", error);
      toast({
        title: "Error",
        description: "Failed to fetch slides",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "hero-carousel"); // Organize images in hero-carousel folder

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed: ${response.status}`);
      }

      const data = await response.json();
      if (!data.url) {
        throw new Error("No URL returned from upload");
      }

      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if title is provided
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    // Check if we have either an existing image URL or a new image file
    if (!formData.image && !imageFile) {
      toast({
        title: "Validation Error",
        description: "Please select an image",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem("admin_token");
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to manage slides",
          variant: "destructive",
        });
        return;
      }

      let imageUrl = formData.image;

      // Upload new image if selected
      if (imageFile) {
        setImageUploading(true);
        try {
          imageUrl = await handleImageUpload(imageFile);
          toast({
            title: "Image Uploaded",
            description: "Image uploaded successfully to Cloudinary",
          });
        } catch (error) {
          toast({
            title: "Upload Failed",
            description: error.message,
            variant: "destructive",
          });
          setImageUploading(false);
          return;
        } finally {
          setImageUploading(false);
        }
      }

      const slideData = {
        ...formData,
        image: imageUrl,
        order: editingSlide ? editingSlide.order : slides.length + 1,
      };

      if (editingSlide) {
        await updateSlide(editingSlide._id, slideData, token);
        toast({
          title: "Success",
          description: "Slide updated successfully",
        });
      } else {
        await createSlide(slideData, token);
        toast({
          title: "Success",
          description: "Slide created successfully",
        });
      }

      handleCloseModal();
      fetchSlides();
    } catch (error) {
      console.error("Error saving slide:", error);
      toast({
        title: "Error",
        description: "Failed to save slide",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (slideId: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to manage slides",
          variant: "destructive",
        });
        return;
      }

      await deleteSlide(slideId, token);
      toast({
        title: "Success",
        description: "Slide deleted successfully",
      });
      fetchSlides();
    } catch (error) {
      console.error("Error deleting slide:", error);
      toast({
        title: "Error",
        description: "Failed to delete slide",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (slideId: string) => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to manage slides",
          variant: "destructive",
        });
        return;
      }

      await toggleSlideStatus(slideId, token);
      toast({
        title: "Success",
        description: "Slide status updated",
      });
      fetchSlides();
    } catch (error) {
      console.error("Error toggling slide status:", error);
      toast({
        title: "Error",
        description: "Failed to update slide status",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (slide: HeroCarouselSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      customContent: slide.customContent || "",
      description: slide.description || "",
      image: slide.image,
      isActive: slide.isActive,
      order: slide.order,
      link: slide.link || "",
      linkText: slide.linkText || "",
    });
    setImagePreview(slide.image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSlide(null);
    setFormData({
      title: "",
      customContent: "",
      description: "",
      image: "",
      isActive: true,
      order: 0,
      link: "",
      linkText: "",
    });
    setImageFile(null);
    setImagePreview("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading slides...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Manage Slides</h3>
          <p className="text-sm text-gray-600">
            {slides.length} slide{slides.length !== 1 ? "s" : ""} •{" "}
            {slides.filter((s) => s.isActive).length} active
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Slide
        </Button>
      </div>

      <div className="grid gap-4">
        {slides.map((slide) => (
          <Card key={slide._id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center space-x-4">
                <div className="relative w-24 h-16 flex-shrink-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover rounded-l-lg"
                  />
                  {!slide.isActive && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <EyeOff className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {slide.title}
                      </h4>
                      {slide.customContent && (
                        <p className="text-sm text-purple-600 mt-1">
                          {slide.customContent}
                        </p>
                      )}
                      {slide.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {slide.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge
                          variant={slide.isActive ? "default" : "secondary"}
                        >
                          {slide.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">Order: {slide.order}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(slide._id)}
                      >
                        {slide.isActive ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(slide)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(slide._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSlide ? "Edit Slide" : "Add New Slide"}
            </DialogTitle>
            <DialogDescription>
              Configure the slide content and appearance
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter slide title"
                  required
                />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Display order"
                />
              </div> */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customContent">Custom Content</Label>
              <Input
                id="customContent"
                value={formData.customContent}
                onChange={(e) =>
                  setFormData({ ...formData, customContent: e.target.value })
                }
                placeholder="Custom overlay text (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Slide description (optional)"
                rows={3}
              />
            </div>

            

            <div className="space-y-2">
              <Label>Image *</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 ${
                  !formData.image && !imageFile
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview("");
                        setImageFile(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    {!formData.image && !imageFile && (
                      <p className="text-xs text-red-500 mb-2">
                        Image is required
                      </p>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-block"
                    >
                      <div className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        Choose Image
                      </div>
                    </Label>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploading || imageUploading}>
                {imageUploading
                  ? "Uploading Image..."
                  : uploading
                    ? "Saving..."
                    : editingSlide
                      ? "Update Slide"
                      : "Create Slide"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
