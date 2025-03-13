import { Content } from '../../models/content';

export class ContentTransformer {
  transform(content: Content) {
    return {
      ...content,
      media: this.transformMedia(content.media || []),
    };
  }

  transformMedia(media: any[]) {
    return media.map((item) => ({
      ...item,
      language: item?.language || 'en', // Default to 'en' if missing
    }));
  }

  transformList(contents: Content[]) {
    return contents.map((content) => this.transform(content));
  }
}
