import React, { useState } from "react";
import { motion } from "framer-motion";
import { Database, Image, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeroCarouselSlides } from "./components/HeroCarouselSlides";

export const DataEntry: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Entry</h1>
          <p className="text-gray-600 mt-1">
            Manage website content and configurations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-purple-600" />
          <span className="text-sm text-gray-500">Content Management</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Tabs defaultValue="hero-carousel" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="hero-carousel"
              className="flex items-center space-x-2"
            >
              <Image className="w-4 h-4" />
              <span>Hero Carousel</span>
            </TabsTrigger>
            {/* <TabsTrigger
              value="banners"
              className="flex items-center space-x-2"
            >
              <Image className="w-4 h-4" />
              <span>Banners</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="hero-carousel" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Image className="w-5 h-5 text-purple-600" />
                  <span>Hero Carousel Slides</span>
                </CardTitle>
                <CardDescription>
                  Manage the slides displayed in the main hero carousel on the
                  homepage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HeroCarouselSlides />
              </CardContent>
            </Card>
          </TabsContent>

         
        </Tabs>
      </motion.div>
    </div>
  );
};
