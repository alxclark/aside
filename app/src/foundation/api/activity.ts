import {ApiCreatorWithReset, StatelessExtensionApiOnHost} from '@aside/core';
import {useMemo} from 'react';

import {useRemoteSubscribableWithStorage} from './shared';

export function useActivityApi(): ApiCreatorWithReset<
  StatelessExtensionApiOnHost['activity']
> {
  const [filter, setFilter, clearFilter, filterReady] =
    useRemoteSubscribableWithStorage('', {storageKey: 'filter'});

  const [invertFilter, setInvertFilter, clearInvertFilter, inverfilterReady] =
    useRemoteSubscribableWithStorage(false, {storageKey: 'invertFilter'});

  const [preserveLog, setPreserveLog, clearPreserveLog, preserveLogReady] =
    useRemoteSubscribableWithStorage(false, {storageKey: 'preserveLog'});

  const [
    recordSnapshot,
    setRecordSnapshot,
    clearRecordSnapshot,
    recordSnapshotReady,
  ] = useRemoteSubscribableWithStorage(false, {storageKey: 'recordSnapshot'});

  const [showFilter, setShowFilter, clearShowFilter, showFilterReady] =
    useRemoteSubscribableWithStorage(false, {storageKey: 'showFilter'});

  const [
    showPreviousValues,
    setShowPreviousValues,
    clearShowPreviousValues,
    showPreviousValuesReady,
  ] = useRemoteSubscribableWithStorage(false, {
    storageKey: 'showPreviousValues',
  });

  const [
    showTimelineOptions,
    setShowTimelineOptions,
    clearShowTimelineOptions,
    showTimelineOptionsReady,
  ] = useRemoteSubscribableWithStorage(false, {
    storageKey: 'showTimelineOptions',
  });

  return useMemo(() => {
    const createApi: ApiCreatorWithReset<
      StatelessExtensionApiOnHost['activity']
    >['api'] = async (_context) => {
      await Promise.all([
        filterReady,
        inverfilterReady,
        preserveLogReady,
        recordSnapshotReady,
        showFilterReady,
        showPreviousValuesReady,
        showTimelineOptionsReady,
      ]);

      const api: StatelessExtensionApiOnHost['activity'] = {
        filter: [filter, setFilter],
        invertFilter: [invertFilter, setInvertFilter],
        preserveLog: [preserveLog, setPreserveLog],
        recordSnapshot: [recordSnapshot, setRecordSnapshot],
        showFilter: [showFilter, setShowFilter],
        showPreviousValues: [showPreviousValues, setShowPreviousValues],
        showTimelineOptions: [showTimelineOptions, setShowTimelineOptions],
      };

      return api;
    };

    const reset = () => {
      clearFilter();
      clearInvertFilter();
      clearPreserveLog();
      clearRecordSnapshot();
      clearShowFilter();
      clearShowPreviousValues();
      clearShowTimelineOptions();
    };

    return {api: createApi, reset};
  }, [
    clearFilter,
    clearInvertFilter,
    clearPreserveLog,
    clearRecordSnapshot,
    clearShowFilter,
    clearShowPreviousValues,
    clearShowTimelineOptions,
    filter,
    filterReady,
    inverfilterReady,
    invertFilter,
    preserveLog,
    preserveLogReady,
    recordSnapshot,
    recordSnapshotReady,
    setFilter,
    setInvertFilter,
    setPreserveLog,
    setRecordSnapshot,
    setShowFilter,
    setShowPreviousValues,
    setShowTimelineOptions,
    showFilter,
    showFilterReady,
    showPreviousValues,
    showPreviousValuesReady,
    showTimelineOptions,
    showTimelineOptionsReady,
  ]);
}
