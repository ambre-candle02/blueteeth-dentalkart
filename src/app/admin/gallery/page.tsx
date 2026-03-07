import { getMedia } from "@/actions/media-actions";
import { GalleryClient } from "./GalleryClient";

export default async function AdminGalleryPage() {
    const response = await getMedia();
    const items = response.success ? response.items : [];

    return (
        <GalleryClient initialItems={items} />
    );
}
