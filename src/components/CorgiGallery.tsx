import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { gaEvent } from "@/lib/analytics";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import heroImage from "@/assets/corgi-hero.jpg";
import derpyImage from "@/assets/corgi-derpy.jpg";
import royalImage from "@/assets/corgi-royal.jpg";
import actionImage from "@/assets/corgi-action.jpg";

type FilterType = "all" | "derpy" | "royal" | "action";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: FilterType[];
  title: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: "hero",
    src: heroImage,
    alt: "Happy corgi with a big smile sitting in a sunny field",
    category: ["all", "derpy"],
    title: "Pure Happiness",
  },
  {
    id: "derpy",
    src: derpyImage,
    alt: "Cute corgi with derpy expression and tongue sticking out",
    category: ["all", "derpy"],
    title: "Derp Mode Activated",
  },
  {
    id: "royal",
    src: royalImage,
    alt: "Royal corgi wearing a tiny crown in regal pose",
    category: ["all", "royal"],
    title: "Your Majesty",
  },
  {
    id: "action",
    src: actionImage,
    alt: "Corgi running at high speed with motion blur",
    category: ["all", "action"],
    title: "Zoomies in Progress",
  },
];

const filters = [
  { id: "all" as FilterType, label: "All Corgis", count: galleryImages.length },
  {
    id: "derpy" as FilterType,
    label: "Derpy Faces",
    count: galleryImages.filter((img) => img.category.includes("derpy")).length,
  },
  {
    id: "royal" as FilterType,
    label: "Royal Pose",
    count: galleryImages.filter((img) => img.category.includes("royal")).length,
  },
  {
    id: "action" as FilterType,
    label: "Action Shots",
    count: galleryImages.filter((img) => img.category.includes("action"))
      .length,
  },
];

export function CorgiGallery() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredImages = galleryImages.filter(
    (image) => activeFilter === "all" || image.category.includes(activeFilter),
  );

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    gaEvent("corgi_gallery_filter", {
      section: "gallery",
      filter,
      total_visible: galleryImages.filter(
        (img) => filter === "all" || img.category.includes(filter),
      ).length,
    });
  };

  const handleImageClick = (imageIndex: number) => {
    const image = filteredImages[imageIndex];
    setSelectedImageIndex(imageIndex);
    setIsModalOpen(true);

    gaEvent("corgi_modal_open", {
      section: "gallery",
      modal_id: "lightbox",
      image_id: image.id,
      image_title: image.title,
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    gaEvent("corgi_modal_close", {
      section: "gallery",
      modal_id: "lightbox",
      time_open: Date.now(), // Could track how long modal was open
    });
  };

  const navigateCarousel = (direction: "next" | "prev") => {
    if (selectedImageIndex === null) return;

    let newIndex: number;
    if (direction === "next") {
      newIndex = (selectedImageIndex + 1) % filteredImages.length;
    } else {
      newIndex =
        selectedImageIndex === 0
          ? filteredImages.length - 1
          : selectedImageIndex - 1;
    }

    setSelectedImageIndex(newIndex);

    gaEvent("corgi_carousel_nav", {
      section: "gallery",
      direction,
      image_id: filteredImages[newIndex].id,
      from_image: filteredImages[selectedImageIndex].id,
    });
  };

  const selectedImage =
    selectedImageIndex !== null ? filteredImages[selectedImageIndex] : null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Corgi Gallery</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A curated collection of the most adorable corgi moments. Click to
            view in full glory!
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => handleFilterChange(filter.id)}
              className={`px-4 py-2 transition-all duration-300 ${
                activeFilter === filter.id
                  ? "shadow-corgi"
                  : "shadow-soft hover:shadow-corgi"
              }`}
              data-ga="gallery_filter"
            >
              {filter.label}
              <Badge variant="secondary" className="ml-2 text-xs">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg shadow-soft hover:shadow-corgi transition-all duration-300 cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleImageClick(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                <p className="text-sm opacity-90">Click to view larger</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-0">
            {selectedImage && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleModalClose}
                  className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
                >
                  <X className="w-4 h-4" />
                </Button>

                <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />

                  <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold mb-2">
                      {selectedImage.title}
                    </h3>
                    <p className="text-muted-foreground">{selectedImage.alt}</p>
                  </div>
                </div>

                {/* Navigation arrows */}
                {filteredImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateCarousel("prev")}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateCarousel("next")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
