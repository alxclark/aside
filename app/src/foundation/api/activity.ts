import {ApiCreator, StatelessExtensionApiOnHost} from '@aside/core';
import {useMemo} from 'react';

import {createPersistedRemoteSubscribable} from '../../utilities/subscribable';

export function useActivityApi(): ApiCreator<
  StatelessExtensionApiOnHost['activity']
> {
  return useMemo(() => {
    const createApi: ApiCreator<
      StatelessExtensionApiOnHost['activity']
    >['api'] = async (_context) => {
      const {
        subscribable: filter,
        update: setFilter,
        clear: clearFilter,
      } = await createPersistedRemoteSubscribable('', {storageKey: 'filter'});

      const {
        subscribable: invertFilter,
        update: setInvertFilter,
        clear: clearInvertFilter,
      } = await createPersistedRemoteSubscribable(false, {
        storageKey: 'invertFilter',
      });

      const {
        subscribable: preserveLog,
        update: setPreserveLog,
        clear: clearPreserveLog,
      } = await createPersistedRemoteSubscribable(false, {
        storageKey: 'preserveLog',
      });

      const {
        subscribable: recordSnapshot,
        update: setRecordSnapshot,
        clear: clearRecordSnapshot,
      } = await createPersistedRemoteSubscribable(false, {
        storageKey: 'recordSnapshot',
      });

      const {
        subscribable: showFilter,
        update: setShowFilter,
        clear: clearShowFilter,
      } = await createPersistedRemoteSubscribable(false, {
        storageKey: 'showFilter',
      });

      const {
        subscribable: showPreviousValues,
        update: setShowPreviousValues,
        clear: clearShowPreviousValues,
      } = await createPersistedRemoteSubscribable(false, {
        storageKey: 'showPreviousValues',
      });

      const {
        subscribable: showTimelineOptions,
        update: setShowTimelineOptions,
        clear: clearShowTimelineOptions,
      } = await createPersistedRemoteSubscribable(false, {
        storageKey: 'showTimelineOptions',
      });

      const api: StatelessExtensionApiOnHost['activity'] = {
        filter: [filter, setFilter],
        invertFilter: [invertFilter, setInvertFilter],
        preserveLog: [preserveLog, setPreserveLog],
        recordSnapshot: [recordSnapshot, setRecordSnapshot],
        showFilter: [showFilter, setShowFilter],
        showPreviousValues: [showPreviousValues, setShowPreviousValues],
        showTimelineOptions: [showTimelineOptions, setShowTimelineOptions],
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

      return [api, reset];
    };

    return {api: createApi};
  }, []);
}
