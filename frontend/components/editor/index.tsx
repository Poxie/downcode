"use client";
import tailwindConfig from '@/tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig'
import { useState, useRef } from 'react';
import ReactCodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { tags as t } from '@lezer/highlight';

const fullConfig = resolveConfig(tailwindConfig);
const backgrounds = fullConfig.theme?.backgroundColor

const theme = createTheme({
    theme: 'dark',
    settings: {
        background: backgrounds?.tertiary as string,
        gutterBackground: backgrounds?.tertiary as string,
        lineHighlight: backgrounds?.quaternary as string,
        selection: backgrounds?.quaternary as string,
    },
    styles: [{ tag: t.keyword, color: '#fb4934' }, { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: '#8ec07c' }, { tag: [t.variableName], color: '#83a598' }, { tag: [t.function(t.variableName)], color: '#b8bb26', fontStyle: 'bold' }, { tag: [t.labelName], color: '#ebdbb2' }, { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#d3869b' }, { tag: [t.definition(t.name), t.separator], color: '#ebdbb2' }, { tag: [t.brace], color: '#ebdbb2' }, { tag: [t.annotation], color: '#fb4934d' }, { tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: '#d3869b' }, { tag: [t.typeName, t.className], color: '#fabd2f' }, { tag: [t.operator, t.operatorKeyword], color: '#fb4934' }, { tag: [t.tagName], color: '#8ec07c', fontStyle: 'bold' }, { tag: [t.squareBracket], color: '#fe8019' }, { tag: [t.angleBracket], color: '#83a598' }, { tag: [t.attributeName], color: '#8ec07c' }, { tag: [t.regexp], color: '#8ec07c' }, { tag: [t.quote], color: '#928374' }, { tag: [t.string], color: '#ebdbb2' }, { tag: t.link, color: '#a89984', textDecoration: 'underline', textUnderlinePosition: 'under' }, { tag: [t.url, t.escape, t.special(t.string)], color: '#d3869b' }, { tag: [t.meta], color: '#fabd2f' }, { tag: [t.comment], color: '#928374', fontStyle: 'italic' }, { tag: t.strong, fontWeight: 'bold', color: '#fe8019' }, { tag: t.emphasis, fontStyle: 'italic', color: '#b8bb26' }, { tag: t.strikethrough, textDecoration: 'line-through' }, { tag: t.heading, fontWeight: 'bold', color: '#b8bb26' }, { tag: [t.heading1, t.heading2], fontWeight: 'bold', color: '#b8bb26' }, { tag: [t.heading3, t.heading4], fontWeight: 'bold', color: '#fabd2f' }, { tag: [t.heading5, t.heading6], color: '#fabd2f' }, { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#d3869b' }, { tag: [t.processingInstruction, t.inserted], color: '#83a598' }, { tag: [t.contentSeparator], color: '#fb4934' }, { tag: t.invalid, color: '#fe8019', borderBottom: "1px dotted #fb4934d" } ]
})

const languages = ['HTML', 'CSS', 'JavaScript'] as const;
export type EditorLanguage = Lowercase<typeof languages[number]>;

const getLanguageExtension = (language: EditorLanguage) => {
    if(language === 'html') return html();
    if(language === 'css') return css();
    return javascript();
}

const TIME_BEFORE_CHANGE_EVENT = 700;
export const Editor: React.FC<{
    onChange?: (language: EditorLanguage, value: string) => void;
    defaultCode?: {
        html: string;
        css: string;
        javascript: string;
    }
}> = ({ onChange, defaultCode }) => {
    const [value, setValue] = useState(defaultCode || {
        html: '',
        css: '',
        javascript: '',
    });
    const [activeLanguage, setActiveLanguage] = useState<EditorLanguage>('html');
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const handleChange = (value: string) => {
        setValue(prev => ({
            ...prev,
            [activeLanguage]: value
        }));
        
        if(onChange) {
            if(timeout.current) clearTimeout(timeout.current);

            timeout.current = setTimeout(() => {
                onChange(activeLanguage, value);
                timeout.current = null;
            }, TIME_BEFORE_CHANGE_EVENT);
        }
    }
    
    return(
        <>
        <ul className="flex bg-tertiary mb-2 rounded-md p-1">
            {languages.map(language => {
                const active = language.toLowerCase() === activeLanguage;
                return(
                    <li key={language}>
                        <button 
                            className={`text-xs ${active ? 'bg-quaternary text-primary' : 'text-secondary'} py-1.5 px-2 rounded-md`}
                            onClick={() => setActiveLanguage(language.toLowerCase() as EditorLanguage)}
                        >
                            {language}
                        </button>
                    </li>
                )
            })}
        </ul>
        <ReactCodeMirror 
            value={value[activeLanguage]}
            extensions={[getLanguageExtension(activeLanguage)]}
            onChange={handleChange}
            theme={theme}
            height="100%"
            className="flex-grow rounded-md overflow-hidden bg-tertiary"
        />
        </>
    )
}