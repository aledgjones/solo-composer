const ctx: any = self;

export async function loadFont(name: string, url: string) {
    const font = new ctx.FontFace(name, `url(${url})`);
    const entry = await font.load()
    ctx.fonts.add(entry);
}