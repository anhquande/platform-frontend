import { storiesOf } from "@storybook/react";
import * as React from "react";

import { SingleFileUpload } from "./SingleFileUpload";

import * as image from "!!url-loader!../../assets/img/header/social_logo.png";

//TODO add error state test
storiesOf("Upload/SingleFileUpload", module)
  .add("default", () => (
    <SingleFileUpload
      acceptedFiles="image/*,application/pdf"
      fileUploading={false}
      fileFormatInformation=".png, .svg"
      label="Some image"
      onDropFile={() => {}}
      onDeleteFile={() => {}}
      name="someImage"
    />
  ))
  .add("with file", () => (
    <SingleFileUpload
      acceptedFiles="image/*,application/pdf"
      fileUploading={false}
      fileFormatInformation=".png, .svg"
      label="Some image"
      file={image}
      onDropFile={() => {}}
      onDeleteFile={() => {}}
      name="someImage"
    />
  ));
