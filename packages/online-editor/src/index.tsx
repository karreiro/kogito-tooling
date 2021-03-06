/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";
import { EMPTY_FILE } from "./common/File";
import { removeDirectories, removeFileExtension } from "./common/utils";

const urlParams = new URLSearchParams(window.location.search);

if (urlParams.has("ext")) {
  window.addEventListener("loadOnlineEditor", (e: CustomEvent) => {
    const file = { fileName: e.detail.fileName, getFileContents: () => Promise.resolve(e.detail.fileContent) };
    ReactDOM.render(
      <App
        iframeTemplateRelativePath={"envelope/index.html"}
        file={file}
        readonly={e.detail.readonly}
        external={true}
        senderTabId={e.detail.senderTabId}
      />,
      document.getElementById("app")!
    );
  });
}

if (urlParams.has("file")) {
  const filePath = urlParams.get("file")!;
  const file = {
    fileName: removeFileExtension(removeDirectories(filePath)!)!,
    getFileContents: () => fetch(filePath).then(response => Promise.resolve(response.text()))
  };
  ReactDOM.render(
    <App iframeTemplateRelativePath={"envelope/index.html"} file={file} readonly={false} external={false} />,
    document.getElementById("app")!
  );
}

if (!urlParams.has("ext") && !urlParams.has("file")) {
  ReactDOM.render(
    <App iframeTemplateRelativePath={"envelope/index.html"} file={EMPTY_FILE} readonly={false} external={false} />,
    document.getElementById("app")!
  );
}
