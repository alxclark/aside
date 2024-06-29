import {
  createRemoteElement,
  BooleanOrString,
  type RemoteElementPropertyType,
} from '@remote-dom/core/elements';

export interface TextProperties {
  emphasis?: boolean | 'strong' | 'subdued';
}

/**
 * Text is used to visually style and provide semantic value for a small piece of text
 * content.
 */
export const Text = createRemoteElement<TextProperties>({
  properties: {
    emphasis: {
      type: BooleanOrString as RemoteElementPropertyType<
        TextProperties['emphasis']
      >,
      default: false,
    },
  },
});

customElements.define('aside-ui-text', Text);

declare global {
  interface HTMLElementTagNameMap {
    'aside-ui-text': InstanceType<typeof Text>;
  }
}
