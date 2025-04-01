import { CreateButton, TopToolbar } from "react-admin";
import { ImportButton } from "../buttons/ImportButton";

export const ListToolbar = (props: ListToolbarProps) => {
    const { canImport = true } = props;

    return (
        <TopToolbar>
            <CreateButton />
            {canImport && <ImportButton />}
        </TopToolbar>
    );
};

export type ListToolbarProps = {
    canImport?: boolean;
};
