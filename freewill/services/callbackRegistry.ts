// Callback registry for passing functions between screens
// This allows us to pass callback functions through route parameters

type CallbackFunction = (imageId: string, base64: string) => void;

class CallbackRegistry {
  private callbacks: Map<string, CallbackFunction> = new Map();

  // Register a callback function and return its ID
  register(callback: CallbackFunction): string {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    this.callbacks.set(id, callback);
    return id;
  }

  // Get and execute a callback function
  execute(id: string, imageId: string, base64: string): boolean {
    const callback = this.callbacks.get(id);
    if (callback) {
      callback(imageId, base64);
      return true;
    }
    return false;
  }

  // Clean up a callback after use
  cleanup(id: string): void {
    this.callbacks.delete(id);
  }

  // Clean up all callbacks (optional, for memory management)
  cleanupAll(): void {
    this.callbacks.clear();
  }
}

export const callbackRegistry = new CallbackRegistry();