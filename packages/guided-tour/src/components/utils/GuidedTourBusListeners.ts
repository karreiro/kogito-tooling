/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useLayoutEffect } from "react";

import { Rect, UserInteraction } from "../../api";
import { EventLabel } from "../../core";

export const useStartTutorialListener = (onStartTutorial: (tutorialLabel: string) => void) => {
  const type = "GuidedTour.startTutorial";
  addListener(type, event => onStartTutorial(event.detail));
};

export const useUserInteractionListener = (onUserInteraction: (userInteraction: UserInteraction) => void) => {
  const type = "GuidedTour.userInteraction";
  addListener(type, event => onUserInteraction(event.detail));
};

export const usePositionListener = (onPositionReceived: (rect: Rect) => void) => {
  const type = "GuidedTour.newPosition";
  addListener(type, event => onPositionReceived(event.detail));
};

function addListener(eventLabel: EventLabel, consumer: (customEvent: CustomEvent) => void) {
  const effect = createEffect(eventLabel, consumer);
  useLayoutEffect(effect, []);
}

function createEffect(eventLabel: EventLabel, consumer: (customEvent: CustomEvent) => void) {
  function listener(e: any) {
    consumer(e as CustomEvent);
  }
  return () => {
    document.addEventListener(eventLabel, listener);
    return () => {
      document.removeEventListener(eventLabel, listener);
    };
  };
}
