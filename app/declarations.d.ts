declare module 'react-quill-new' {
  import { Component } from 'react';
  
  export interface ReactQuillProps {
    theme?: string;
    value?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
    modules?: any;
    formats?: string[];
    className?: string;
  }

  export default class ReactQuill extends Component<ReactQuillProps> {}
}

declare module 'react-quill-new/dist/quill.snow.css';