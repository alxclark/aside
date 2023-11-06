import {useContext, useMemo} from 'react';
import {useExtensionApi, useSubscription} from '@aside/react';
import {type GetterSetterTuple} from '@aside/core';

import {ActivityStoreContext} from '../contexts';
import {ActivityContext} from '../types';

export function useActivity(): ActivityContext {
  const stores = useContext(ActivityStoreContext);
  const {activity} = useExtensionApi();

  if (!stores) {
    throw new Error(`No activity available in context`);
  }

  const filterSubscription = useSubscription(activity.filter[0]);
  const invertFilterSubscription = useSubscription(activity.invertFilter[0]);
  const preserveLogSubscription = useSubscription(activity.preserveLog[0]);
  const recordSnapshotSubscription = useSubscription(
    activity.recordSnapshot[0],
  );
  const showFilterSubscription = useSubscription(activity.showFilter[0]);
  const showPreviousValuesSubscription = useSubscription(
    activity.showPreviousValues[0],
  );
  const showTimelineOptionsSubscription = useSubscription(
    activity.showTimelineOptions[0],
  );

  const filter = useMemo<GetterSetterTuple<string>>(
    () => [filterSubscription, activity.filter[1]],
    [activity.filter, filterSubscription],
  );

  const invertFilter = useMemo<GetterSetterTuple<boolean>>(
    () => [invertFilterSubscription, activity.invertFilter[1]],
    [activity.invertFilter, invertFilterSubscription],
  );

  const preserveLog = useMemo<GetterSetterTuple<boolean>>(
    () => [preserveLogSubscription, activity.preserveLog[1]],
    [activity.preserveLog, preserveLogSubscription],
  );

  const recordSnapshot = useMemo<GetterSetterTuple<boolean>>(
    () => [recordSnapshotSubscription, activity.recordSnapshot[1]],
    [activity.recordSnapshot, recordSnapshotSubscription],
  );

  const showFilter = useMemo<GetterSetterTuple<boolean>>(
    () => [showFilterSubscription, activity.showFilter[1]],
    [activity.showFilter, showFilterSubscription],
  );

  const showPreviousValues = useMemo<GetterSetterTuple<boolean>>(
    () => [showPreviousValuesSubscription, activity.showPreviousValues[1]],
    [activity.showPreviousValues, showPreviousValuesSubscription],
  );

  const showTimelineOptions = useMemo<GetterSetterTuple<boolean>>(
    () => [showTimelineOptionsSubscription, activity.showTimelineOptions[1]],
    [activity.showTimelineOptions, showTimelineOptionsSubscription],
  );

  const api = useMemo<ActivityContext>(
    () => ({
      stores,
      filter,
      invertFilter,
      preserveLog,
      recordSnapshot,
      showFilter,
      showPreviousValues,
      showTimelineOptions,
    }),
    [
      filter,
      invertFilter,
      preserveLog,
      recordSnapshot,
      showFilter,
      showPreviousValues,
      showTimelineOptions,
      stores,
    ],
  );

  return api;
}
