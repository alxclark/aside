import {signal, computed} from 'signals-react-safe';

export const counter = signal(0);
export const counterSquared = computed(() => counter.value ** 2);
