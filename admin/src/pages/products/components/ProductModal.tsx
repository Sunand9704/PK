import React, { useState, useEffect, ChangeEvent } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    description: "",
    sizes: [] as string[],
    colors: [] as string[],
    features: [] as string[],
    inStock: true,
    images: [] as string[],
  });
  const { toast } = useToast();
  const [localImages, setLocalImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const baseUrl = "http://localhost:8000";
  const [rawInputs, setRawInputs] = useState({
    sizes: "",
    colors: "",
    features: "",
  });
  const [loading, setLoading] = useState(false);
  const getToken = () => localStorage.getItem('admin_token');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        price: product.price?.toString() || "",
        originalPrice: product.originalPrice?.toString() || "",
        description: product.description || "",
        sizes: product.sizes || [],
        colors: product.colors || [],
        features: product.features || [],
        inStock: product.inStock !== undefined ? product.inStock : true,
        images: product.images || [],
      });
      setRawInputs({
        sizes: (product.sizes || []).join(", "),
        colors: (product.colors || []).join(", "),
        features: (product.features || []).join(", "),
      });
      setImagePreviews(product.images || []);
      setLocalImages([]);
    } else {
      setFormData({
        name: "",
        category: "",
        price: "",
        originalPrice: "",
        description: "",
        sizes: [],
        colors: [],
        features: [],
        inStock: true,
        images: [],
      });
      setRawInputs({ sizes: "", colors: "", features: "" });
      setImagePreviews([]);
      setLocalImages([]);
    }
  }, [product]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper for comma-separated input fields
  const handleArrayInput = (field: string, value: string) => {
    // Always update the input as a string for display
    setFormData((prev) => ({
      ...prev,
      [field]: value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    }));
  };

  // Helper to handle onBlur for array fields
  const handleArrayBlur = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    }));
  };

  // Handle image URLs as comma-separated for now (can be replaced with upload logic)
  const handleImagesInput = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      images: value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    }));
  };

  // Preview local images before upload
  const handleImageFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setLocalImages((prev) => [...prev, ...newFiles]);
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreviews((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image (both preview and local file)
  const handleRemoveImage = (idx: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    setLocalImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // Upload images to server and get URLs
  const uploadImageToServer = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.url;
  };

  // On submit, upload images, then submit product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Ensure arrays are up to date from rawInputs
    const sizes = rawInputs.sizes
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    const colors = rawInputs.colors
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    const features = rawInputs.features
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    let imageUrls = formData.images;
    if (localImages.length > 0) {
      imageUrls = [];
      for (let i = 0; i < localImages.length; i++) {
        const url = await uploadImageToServer(localImages[i]);
        imageUrls.push(url);
      }
    }
    const productData = {
      ...formData,
      sizes,
      colors,
      features,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice
        ? parseFloat(formData.originalPrice)
        : undefined,
      images: imageUrls,
    };

    try {
      let res;
      if (product && product._id) {
        // Update
        res = await fetch(`${baseUrl}/api/admin/products/${product._id}`, {
          method: "PUT",
          headers: { 
            'Authorization': `Bearer ${getToken()}`,
            "Content-Type": "application/json" },
          body: JSON.stringify(productData),
          credentials: "include",
        });
      } else {
        // Create
        res = await fetch(`${baseUrl}/api/admin/products`, {
          method: "POST",
          headers: { 
            'Authorization': `Bearer ${getToken()}`,
            "Content-Type": "application/json" },
          body: JSON.stringify(productData),
          credentials: "include",
        });
      }
      if (!res.ok) {
        const error = await res.json();
        toast({
          title: "Error",
          description: error.msg || "Failed to save product",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      toast({
        title: product ? "Product updated" : "Product created",
        description: `${formData.name} has been ${product ? "updated" : "created"} successfully.`,
      });
      setLoading(false);
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleImageFiles(e.dataTransfer.files);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shirts">Shirts</SelectItem>
                  <SelectItem value="pants">Pants</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price ($)</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) =>
                  handleInputChange("originalPrice", e.target.value)
                }
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sizes">Sizes (comma separated)</Label>
              <Input
                id="sizes"
                value={rawInputs.sizes}
                onChange={(e) =>
                  setRawInputs((prev) => ({ ...prev, sizes: e.target.value }))
                }
                onBlur={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sizes: e.target.value
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="S, M, L, XL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="colors">Colors (comma separated)</Label>
              <Input
                id="colors"
                value={rawInputs.colors}
                onChange={(e) =>
                  setRawInputs((prev) => ({ ...prev, colors: e.target.value }))
                }
                onBlur={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    colors: e.target.value
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="Red, Blue, Black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">Features (comma separated)</Label>
              <Input
                id="features"
                value={rawInputs.features}
                onChange={(e) =>
                  setRawInputs((prev) => ({
                    ...prev,
                    features: e.target.value,
                  }))
                }
                onBlur={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    features: e.target.value
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="100% Cotton, Machine Washable"
              />
            </div>
            <div className="space-y-2 flex items-center mt-6">
              <Label htmlFor="inStock" className="mr-2">
                In Stock
              </Label>
              <input
                id="inStock"
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => handleInputChange("inStock", e.target.checked)}
                className="h-5 w-5"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Product Images</Label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() =>
                document.getElementById("image-upload-input")?.click()
              }
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Drag and drop images here, or click to select files
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <input
                id="image-upload-input"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImageFiles(e.target.files)}
              />
            </div>
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4 justify-center">
                {imagePreviews.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      alt={`Product Preview ${idx + 1}`}
                      className="h-24 w-24 object-cover rounded shadow border"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Product description..."
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  Saving...
                </span>
              ) : product ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
