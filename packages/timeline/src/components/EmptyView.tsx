import {Text, View} from '@aside/chrome-ui-remote';

export function EmptyView() {
  return (
    <View className="flex h-full justify-center items-center flex-col gap-2">
      <Text>Recording activity...</Text>
      <Text>Perform an action or hit ⌘ R to record the reload.</Text>
    </View>
  );
}
