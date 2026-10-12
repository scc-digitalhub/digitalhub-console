// SPDX-FileCopyrightText: © 2026 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    useRef,
    useCallback,
    useEffect,
    type PointerEvent as ReactPointerEvent,
} from 'react';
import { useAssistant, ModalSize } from '../AssistantContext';

const MIN_WIDTH = 380;
const MIN_HEIGHT = 450;

export interface UseModalResizeResult {
    size: ModalSize;
    startResizing: (e: ReactPointerEvent) => void;
}

export const useModalResize = (): UseModalResizeResult => {
    const { modalSize, setModalSize } = useAssistant();
    const sizeRef = useRef(modalSize);
    sizeRef.current = modalSize;

    const dragCleanupRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        return () => {
            if (dragCleanupRef.current) {
                dragCleanupRef.current();
            }
        };
    }, []);

    const startResizing = useCallback(
        (e: ReactPointerEvent) => {
            if (e.button !== 0) return;
            e.preventDefault();
            e.stopPropagation();

            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = sizeRef.current.width;
            const startHeight = sizeRef.current.height;

            const previousUserSelect = document.body.style.userSelect;
            document.body.style.userSelect = 'none';

            const onPointerMove = (moveEvent: PointerEvent) => {
                const deltaX = startX - moveEvent.clientX;
                const deltaY = startY - moveEvent.clientY;

                const maxWidth = Math.max(MIN_WIDTH, window.innerWidth - 32);
                const maxHeight = Math.max(
                    MIN_HEIGHT,
                    window.innerHeight - 100
                );

                const newWidth = Math.round(
                    Math.min(maxWidth, Math.max(MIN_WIDTH, startWidth + deltaX))
                );
                const newHeight = Math.round(
                    Math.min(
                        maxHeight,
                        Math.max(MIN_HEIGHT, startHeight + deltaY)
                    )
                );

                const nextSize = { width: newWidth, height: newHeight };
                sizeRef.current = nextSize;
                setModalSize(nextSize);
            };

            const cleanup = () => {
                document.body.style.userSelect = previousUserSelect;
                window.removeEventListener('pointermove', onPointerMove);
                window.removeEventListener('pointerup', onPointerUp);
                window.removeEventListener('pointercancel', onPointerUp);
                dragCleanupRef.current = null;
            };

            const onPointerUp = () => {
                cleanup();
            };

            dragCleanupRef.current = cleanup;
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
            window.addEventListener('pointercancel', onPointerUp);
        },
        [setModalSize]
    );

    return { size: modalSize, startResizing };
};
