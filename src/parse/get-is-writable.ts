function isWritable(duration: number, subdivisions: number) {
    switch (duration / subdivisions) {
        case .25: // semiquaver
        case .5: // quaver
        case 1: // crotchet
        case 2: // minim
        case 4: // whole
            return true;
        default:
            return false;
    }

}

export function getIsWritable(duration: number, subdivisions: number) {
    let glyph = isWritable(duration, subdivisions);
    if (!glyph) {
        glyph = isWritable((duration / 3) * 2, subdivisions);
    }
    return glyph;
}