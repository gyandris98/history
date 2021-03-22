import Embed from '@editorjs/embed';
import Paragraph from '@editorjs/paragraph';
import Image from '@editorjs/image';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import List from '@editorjs/list';
import { EDITOR_ENDPOINT } from '../api/image';

export const EDITOR_JS_TOOLS = {
  header: {
    class: Header,
  },
  embed: {
    class: Embed,
    inlineToolbar: true,
    config: {
      services: {
        youtube: true,
      },
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: 'Idézet',
      captionPlaceholder: 'Szerző',
    },
  },
  image: {
    class: Image,
    config: {
      endpoints: {
        byFile: EDITOR_ENDPOINT,
        byUrl: EDITOR_ENDPOINT + 'url',
      },
      additionalRequestHeaders: {},
    },
  },
  list: {
    class: List,
  },
};
