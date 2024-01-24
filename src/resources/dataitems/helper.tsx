import * as changeCase from "change-case";
import { ReactElement } from "react";
import {
  BooleanField,
  DateField,
  EmailField,
  FunctionField,
  NumberField,
  TextField,
  UrlField,
} from "react-admin";

export const getReactField = (
  fieldDescriptor: any,
  index: number
): ReactElement => {
  const field = changeCase.camelCase(fieldDescriptor.name);
  const label = fieldDescriptor.name;

  //this method does not manage the following types: object, array, geopoint, geojson and any

  switch (fieldDescriptor.type) {
    case "string":
      switch (fieldDescriptor?.format) {
        case "email":
          return (
            <EmailField
              source={field}
              label={label}
              key={`dataitem-preview-${field}-${index}`}
            />
          );
        case "uri":
          return (
            <UrlField
              source={field}
              label={label}
              key={`dataitem-preview-${field}-${index}`}
            />
          );
        case "binary":
          return (
            <FunctionField
              source={field}
              label={label}
              key={`dataitem-preview-${field}-${index}`}
              render={() => undefined}
              sortable={false}
            />
          );
        default:
          return (
            <TextField
              source={field}
              label={label}
              key={`dataitem-preview-${field}-${index}`}
            />
          );
      }
    case "number":
      return (
        <NumberField
          source={field}
          label={label}
          key={`dataitem-preview-${field}-${index}`}
          textAlign="left"
        />
      );
    case "integer":
      return (
        <NumberField
          source={field}
          label={label}
          key={`dataitem-preview-${field}-${index}`}
          textAlign="left"
        />
      );
    case "boolean":
      return (
        <BooleanField
          source={field}
          label={label}
          key={`dataitem-preview-${field}-${index}`}
        />
      );
    case "date":
      return (
        <DateField
          source={field}
          label={label}
          key={`dataitem-preview-${field}-${index}`}
          showTime={false}
        />
      );
    //check
    case "time":
      return (
        <DateField
          source={field}
          label={label}
          key={`dataitem-preview-${field}-${index}`}
          showDate={false}
        />
      );
    case "datetime":
      return (
        <DateField
          source={field}
          label={label}
          key={`dataitem-preview-${field}-${index}`}
          showTime={true}
        />
      );
    //check
    case "year":
      return (
        <DateField
          source={field}
          label={label}
          key={`dataitem-preview-${field}-${index}`}
          showTime={false}
          options={{ year: "numeric" }}
        />
      );
    //check
    case "month":
      return (
        <DateField
          source={field}
          label={label}
          key={`dataitem-preview-${field}-${index}`}
          showTime={false}
          options={{ year: "numeric", month: "2-digit" }}
        />
      );
    default:
      return (
        <FunctionField
          source={field}
          label={label}
          key={`dataitem-preview-${field}-${index}`}
          render={() => undefined}
          sortable={false}
        />
      );
  }
};

export const isFieldValid = (fieldDescriptor: any): boolean => {
  switch (fieldDescriptor.type) {
    case "string":
      switch (fieldDescriptor?.format) {
        case "email":
          return true;
        case "uri":
          return true;
        case "binary":
          return false;
        default:
          return true;
      }
    case "number":
      return true;
    case "integer":
      return true;
    case "boolean":
      return true;
    case "date":
      return true;
    case "time":
      return true;
    case "datetime":
      return true;
    case "year":
      return true;
    case "month":
      return true;
    default:
      return false;
  }
};
