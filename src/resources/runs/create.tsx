import { useRootSelector } from "@dslab/ra-root-selector";
import { Create, SimpleForm } from "react-admin";

export const RunCreate = () => {
  const { root } = useRootSelector();

  const transform = (data) => ({
    ...data,
    project: root || "",
  });

  const validator = () => {
    const errors: any = {};
    return errors;
  };



  return (
    <Create transform={transform} redirect="list">
      <SimpleForm validate={validator}>
      <div>create Run</div>
      </SimpleForm>
    </Create>
  );
};
