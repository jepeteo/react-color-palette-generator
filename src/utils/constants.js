// Application constants
export const HARMONY_TYPES = {
    TRIADIC: 'triadic',
    COMPLEMENTARY: 'complementary',
    ANALOGOUS: 'analogous',
    SPLIT_COMPLEMENTARY: 'split-complementary',
    TETRADIC: 'tetradic',
    MONOCHROMATIC: 'monochromatic',
    SQUARE: 'square',
    DOUBLE_SPLIT_COMPLEMENTARY: 'double-split-complementary'
};

export const HARMONY_LABELS = {
    [HARMONY_TYPES.TRIADIC]: 'Triadic',
    [HARMONY_TYPES.COMPLEMENTARY]: 'Complementary',
    [HARMONY_TYPES.ANALOGOUS]: 'Analogous',
    [HARMONY_TYPES.SPLIT_COMPLEMENTARY]: 'Split Complementary',
    [HARMONY_TYPES.TETRADIC]: 'Tetradic',
    [HARMONY_TYPES.MONOCHROMATIC]: 'Monochromatic',
    [HARMONY_TYPES.SQUARE]: 'Square',
    [HARMONY_TYPES.DOUBLE_SPLIT_COMPLEMENTARY]: 'Double Split Complementary'
};

export const PALETTE_ROLES = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    ACCENT: 'accent',
    TEXT: 'text',
    BACKGROUND: 'background',
    SURFACE: 'surface',
    ERROR: 'error',
    WARNING: 'warning',
    SUCCESS: 'success',
    INFO: 'info'
};

export const WCAG_LEVELS = {
    AA: 'AA',
    AAA: 'AAA',
    LARGE_TEXT: 'Large Text'
};

export const CONTRAST_RATIOS = {
    [WCAG_LEVELS.AA]: 4.5,
    [WCAG_LEVELS.AAA]: 7.0,
    [WCAG_LEVELS.LARGE_TEXT]: 3.0
};

export const EXPORT_FORMATS = {
    JSON: 'json',
    CSS: 'css',
    SCSS: 'scss',
    LESS: 'less',
    TAILWIND: 'tailwind'
};

export const UI_ELEMENTS = {
    BACKGROUND: 'background',
    HEADER_BACKGROUND: 'headerBackground',
    HEADER_TEXT: 'headerText',
    NAV_BACKGROUND: 'navBackground',
    NAV_TEXT: 'navText',
    HEADING1: 'heading1',
    HEADING2: 'heading2',
    PARAGRAPH_TEXT: 'paragraphText',
    LINK_TEXT: 'linkText',
    BLOCKQUOTE_BORDER: 'blockquoteBorder',
    BLOCKQUOTE_TEXT: 'blockquoteText',
    LIST_TEXT: 'listText',
    BUTTON_BACKGROUND: 'buttonBackground',
    BUTTON_TEXT: 'buttonText',
    INPUT_BACKGROUND: 'inputBackground',
    INPUT_TEXT: 'inputText',
    INPUT_BORDER: 'inputBorder',
    FOOTER_BACKGROUND: 'footerBackground',
    FOOTER_TEXT: 'footerText'
};

export const UI_ELEMENT_LABELS = {
    [UI_ELEMENTS.BACKGROUND]: 'Background',
    [UI_ELEMENTS.HEADER_BACKGROUND]: 'Header Background',
    [UI_ELEMENTS.HEADER_TEXT]: 'Header Text',
    [UI_ELEMENTS.NAV_BACKGROUND]: 'Navigation Background',
    [UI_ELEMENTS.NAV_TEXT]: 'Navigation Text',
    [UI_ELEMENTS.HEADING1]: 'Heading 1',
    [UI_ELEMENTS.HEADING2]: 'Heading 2',
    [UI_ELEMENTS.PARAGRAPH_TEXT]: 'Paragraph Text',
    [UI_ELEMENTS.LINK_TEXT]: 'Link Text',
    [UI_ELEMENTS.BLOCKQUOTE_BORDER]: 'Blockquote Border',
    [UI_ELEMENTS.BLOCKQUOTE_TEXT]: 'Blockquote Text',
    [UI_ELEMENTS.LIST_TEXT]: 'List Text',
    [UI_ELEMENTS.BUTTON_BACKGROUND]: 'Button Background',
    [UI_ELEMENTS.BUTTON_TEXT]: 'Button Text',
    [UI_ELEMENTS.INPUT_BACKGROUND]: 'Input Background',
    [UI_ELEMENTS.INPUT_TEXT]: 'Input Text',
    [UI_ELEMENTS.INPUT_BORDER]: 'Input Border',
    [UI_ELEMENTS.FOOTER_BACKGROUND]: 'Footer Background',
    [UI_ELEMENTS.FOOTER_TEXT]: 'Footer Text'
};
