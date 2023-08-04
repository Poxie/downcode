"use client";
import { useEffect, useRef } from 'react';

// STRICTLY TEMPORARY. IFRAMES CAN USE window.parent.window TO ACCESS THE PARENT WINDOW
// WHICH IN TURN CAN ACCESS THINGS SUCH AS COOKIES, LOCALSTORAGE, ETC. LARGE SECURITY FLAW.
export const Preview: React.FC<{
    html: string;
    css: string;
    javascript: string;
}> = ({ html, css, javascript }) => {
    const sandbox = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const doc = sandbox.current?.contentDocument || sandbox.current?.contentWindow?.document;
        if(!doc) return;

        const style = doc.createElement('style');
        style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap');
        body {
            font-family: 'Inter';
        }
        `
        doc.head.append(style);
    }, [sandbox.current]);

    useEffect(() => {
        const doc = sandbox.current?.contentDocument || sandbox.current?.contentWindow?.document;
        if(!doc) return;

        doc.body.innerHTML = html;

        doc.querySelector('.style')?.remove();
        const style = doc.createElement('style');
        style.classList.add('style')
        style.innerHTML = `
            body {
                color: #fff;
            }
            ${css}
        `;
        doc.head.append(style);

        doc.querySelector('.script')?.remove();
        const script = doc.createElement('script');
        script.classList.add('script');
        script.append(javascript);
        doc.body.appendChild(script);
    }, [html, css, javascript]);

    return(
        <iframe 
            className="rounded-md bg-tertiary"
            ref={sandbox} 
        />
    )
}