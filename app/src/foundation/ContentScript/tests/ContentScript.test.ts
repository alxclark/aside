import {createEndpoint} from '@remote-ui/rpc';
import {createPort, mockBrowser} from 'testing/browser';

import {contentScript} from '../ContentScript';

vi.mock('@remote-ui/rpc');

describe('ContentScript', () => {
  const mockCreateEndpoint = vi.fn((..._args: any[]) => {
    return {
      call: {
        getRemoteChannel: vi.fn(),
        mountDevtools: vi.fn(),
        unmountDevtools: vi.fn(),
        log: vi.fn(),
      },
      expose: vi.fn(),
      replace: vi.fn(),
      callable: vi.fn(),
      terminate: vi.fn(),
    };
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createEndpoint).mockImplementation((...args: any[]) =>
      mockCreateEndpoint(...args),
    );
  });

  it('attempts a connection to the browser runtime', () => {
    const mockOnMessageListener = vi.fn();
    const mockConnect = vi.fn(() =>
      createPort({
        onMessage: {
          addListener: mockOnMessageListener,
        },
      }),
    );

    mockBrowser({
      runtime: {
        connect: mockConnect,
      },
    });

    contentScript();

    expect(mockConnect).toHaveBeenCalledWith({
      name: 'content-script',
    });
    expect(mockOnMessageListener).toHaveBeenCalled();
  });

  describe('when the devtools page is ready before the content script', () => {
    it('does not setup the port if the devtools does not sent a message to accept the port', () => {
      const mockOnMessageListener = vi.fn();
      const mockConnect = vi.fn(() =>
        createPort({
          onMessage: {
            addListener: mockOnMessageListener,
          },
        }),
      );

      mockBrowser({
        runtime: {
          connect: mockConnect,
        },
      });

      contentScript();

      expect(mockCreateEndpoint).not.toHaveBeenCalledWith(expect.anything(), {
        callable: ['getRemoteChannel', 'getApi'],
      });

      const onAcceptedPortListener = mockOnMessageListener.mock.calls[0][0];

      onAcceptedPortListener('hello', createPort());

      expect(mockCreateEndpoint).not.toHaveBeenCalledWith(expect.anything(), {
        callable: ['getRemoteChannel', 'getApi'],
      });
    });

    describe('when the devtools sent a message to accept the port', () => {
      it('creates an endpoint for the devtools', async () => {
        const mockOnMessageListener = vi.fn();
        const mockConnect = vi.fn(() =>
          createPort({
            onMessage: {
              addListener: mockOnMessageListener,
            },
          }),
        );

        mockBrowser({
          runtime: {
            connect: mockConnect,
          },
        });

        contentScript();

        expect(mockCreateEndpoint).not.toHaveBeenCalledWith(expect.anything(), {
          callable: ['getRemoteChannel', 'getApi'],
        });

        const onAcceptedPortListener = mockOnMessageListener.mock.calls[0][0];

        await onAcceptedPortListener(
          {type: 'accept-port', sender: 'dev'},
          createPort(),
        );

        expect(mockCreateEndpoint).toHaveBeenCalledWith(expect.anything(), {
          callable: ['getRemoteChannel', 'getApi'],
        });
      });

      it('creates an endpoint for the webpage', async () => {
        const mockOnMessageListener = vi.fn();
        const mockConnect = vi.fn(() =>
          createPort({
            onMessage: {
              addListener: mockOnMessageListener,
            },
          }),
        );

        mockBrowser({
          runtime: {
            connect: mockConnect,
          },
        });

        contentScript();

        expect(mockCreateEndpoint).toHaveBeenCalledWith(expect.anything(), {
          callable: ['mountDevtools', 'unmountDevtools', 'log'],
          createEncoder: expect.anything(),
        });
      });
    });
  });
});
