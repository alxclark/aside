import {createRemoteElement} from '@remote-dom/core/elements';

export interface ButtonProperties {
  /**
   * A URL to open when the button is clicked.
   */
  to?: string;

  /**
   * Disallows interaction with the button.
   */
  disabled?: boolean;

  /**
   * A callback that is run when the button is pressed.
   */
  onPress?(): void | Promise<void>;
}

export interface ButtonSlots {}

/**
 * Buttons are the primary component used to allow user action.
 */
export const Button = createRemoteElement<ButtonProperties, {}, ButtonSlots>({
  slots: [],
  properties: {
    to: {type: String},
    disabled: {type: Boolean},
    onPress: {type: Function},
  },
});

customElements.define('aside-ui-button', Button);

declare global {
  interface HTMLElementTagNameMap {
    'aside-ui-button': InstanceType<typeof Button>;
  }
}
