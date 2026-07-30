declare module 'react-quill-new' {
  import { Component, RefObject } from 'react';
  
  export interface ReactQuillProps {
    ref?: RefObject<any>;
    theme?: string;
    value?: string;
    onChange?: (content: string, delta: any, source: any, editor: any) => void;
    placeholder?: string;
    modules?: any;
    formats?: string[];
    className?: string;
  }

  export default class ReactQuill extends Component<ReactQuillProps> {
    getEditor(): any;
  }
}

declare module 'react-quill-new/dist/quill.snow.css';
