import React from 'react';
import {View, Icon, Link, Text} from '@aside/chrome-ui';

export function NotConnected() {
  return (
    <View className="p-2 h-full">
      <View className="flex h-full justify-center items-center flex-col gap-2">
        <Icon source="power-off" size="lg" variant="subdued" />
        <Text align="center">This website is not connected to Aside.</Text>
        <Text align="center">
          Learn how to integrate your application at{' '}
          <Link to="https://github.com/alxclark/aside">
            https://github.com/alxclark/aside
          </Link>
          .
        </Text>
      </View>
    </View>
  );
}
