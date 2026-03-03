// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useFileContext } from '../features/files/FileContext';
import { forwardRef } from 'react';
import { LinkProps, useHref, useLinkClickHandler } from 'react-router-dom';

/**
 * Adaptation of react-router Link to warn the user before navigation if there are ongoing uploads
 */
export const UploadSafeLink = forwardRef<HTMLAnchorElement, LinkProps>(
    function LinkWithRef(props, forwardedRef) {
        const {
            onClick,
            discover = 'render',
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            prefetch = 'none',
            relative,
            reloadDocument,
            replace,
            state,
            target,
            to,
            preventScrollReset,
            viewTransition,
            ...rest
        } = props;

        const {
            uploadStatusController: { uploading },
        } = useFileContext();

        const isAbsolute =
            typeof to === 'string' && /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(to);

        const href = useHref(to, { relative });

        const internalOnClick = useLinkClickHandler(to, {
            replace,
            state,
            target,
            preventScrollReset,
            relative,
            viewTransition,
        });

        const handleClick = event => {
            if (!event.defaultPrevented) {
                //if uploading, beforeunload event is already handled
                if (!uploading) {
                    if (onClick) onClick(event);
                    internalOnClick(event);
                }
            }
        };

        return (
            <a
                {...rest}
                href={href}
                onClick={reloadDocument ? onClick : handleClick}
                ref={forwardedRef}
                target={target}
                data-discover={
                    !isAbsolute && discover === 'render' ? 'true' : undefined
                }
            />
        );
    }
);
