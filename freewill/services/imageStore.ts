// Simple in-memory store for image data
class ImageStore {
  private store: Map<string, string> = new Map();

  setImage(id: string, base64: string): void {
    this.store.set(id, base64);
  }

  getImage(id: string): string | null {
    return this.store.get(id) || null;
  }

  removeImage(id: string): void {
    this.store.delete(id);
  }

  generateId(): string {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const imageStore = new ImageStore();