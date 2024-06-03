import { CSSProperties, JSXElementConstructor, ReactElement } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {
    ArrayFieldTemplateItemType,
    FormContextType,
    RJSFSchema,
    StrictRJSFSchema,
} from '@rjsf/utils';
import { useTranslate } from 'react-admin';

/** The `ArrayFieldItemTemplate` component is the template used to render an items of an array.
 *
 * @param props - The `ArrayFieldTemplateItemType` props for the component
 */
export default function ArrayFieldItemTemplate<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>(props: ArrayFieldTemplateItemType<T, S, F>) {
    const {
        children,
        disabled,
        hasToolbar,
        hasCopy,
        hasMoveDown,
        hasMoveUp,
        hasRemove,
        index,
        onCopyIndexClick,
        onDropIndexClick,
        onReorderClick,
        readonly,
        uiSchema,
        registry,
    } = props;
    const translate = useTranslate();

    const { CopyButton, MoveDownButton, MoveUpButton, RemoveButton } =
        registry.templates.ButtonTemplates;
    const btnStyle: CSSProperties = {
        flex: 1,
        paddingLeft: 6,
        paddingRight: 6,
        fontWeight: 'bold',
        minWidth: 0,
        marginTop: 16,
        minHeight: 40,
    };
    function childrenTranslated(children: ReactElement<any, string | JSXElementConstructor<any>>): import("react").ReactNode {
        const title= children.props.schema.title||""
        const description= children.props.schema.description||""
        children.props.schema.title=translate(title);
        children.props.schema.description=translate(description);
        return children;
    }

    return (
        <Grid container={true} alignItems="top">
            <Grid item={true} xs style={{ overflow: 'auto' }}>
                <Box>
                <Box>{childrenTranslated(children)}</Box>
                {/* <Box>{children}</Box> */}
                </Box>
            </Grid>
            {hasToolbar && !readonly && (
                <Grid item={true}>
                    {(hasMoveUp || hasMoveDown) && (
                        <MoveUpButton
                            style={btnStyle}
                            disabled={disabled || readonly || !hasMoveUp}
                            onClick={onReorderClick(index, index - 1)}
                            uiSchema={uiSchema}
                            registry={registry}
                        />
                    )}
                    {(hasMoveUp || hasMoveDown) && (
                        <MoveDownButton
                            style={btnStyle}
                            disabled={disabled || readonly || !hasMoveDown}
                            onClick={onReorderClick(index, index + 1)}
                            uiSchema={uiSchema}
                            registry={registry}
                        />
                    )}
                    {hasCopy && (
                        <CopyButton
                            style={btnStyle}
                            disabled={disabled || readonly}
                            onClick={onCopyIndexClick(index)}
                            uiSchema={uiSchema}
                            registry={registry}
                        />
                    )}
                    {hasRemove && (
                        <RemoveButton
                            style={btnStyle}
                            disabled={disabled || readonly}
                            onClick={onDropIndexClick(index)}
                            uiSchema={uiSchema}
                            registry={registry}
                        />
                    )}
                </Grid>
            )}
        </Grid>
    );
}
