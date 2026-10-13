"use client";
import { useEffect, useRef } from "react";
const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(",");
export function useModalAccessibility({ isOpen, onClose, containerRef, }) {
    const onCloseRef = useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);
    useEffect(() => {
        if (!isOpen)
            return;
        const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const previousBodyOverflow = document.body.style.overflow;
        const dialog = containerRef.current;
        document.body.style.overflow = "hidden";
        const focusFrame = window.requestAnimationFrame(() => {
            const autofocusTarget = dialog?.querySelector("[data-autofocus]");
            (autofocusTarget ?? dialog)?.focus({ preventScroll: true });
        });
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onCloseRef.current();
                return;
            }
            if (event.key !== "Tab" || !dialog)
                return;
            const focusableElements = Array.from(dialog.querySelectorAll(focusableSelector)).filter((element) => !element.hasAttribute("disabled") && element.tabIndex !== -1);
            if (focusableElements.length === 0) {
                event.preventDefault();
                dialog.focus();
                return;
            }
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            const activeElement = document.activeElement;
            if (event.shiftKey && (activeElement === firstElement || !dialog.contains(activeElement))) {
                event.preventDefault();
                lastElement.focus();
            }
            else if (!event.shiftKey && activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            window.cancelAnimationFrame(focusFrame);
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousBodyOverflow;
            previouslyFocused?.focus({ preventScroll: true });
        };
    }, [containerRef, isOpen]);
}
