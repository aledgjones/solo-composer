import { fileAccepted } from ".";

it('No accept param', () => {
    const file = new File([], 'file.pdf', { type: 'application/pdf' });
    const match = fileAccepted(file, undefined);
    expect(match).toEqual(true);
});

it('Single identicle accept', () => {
    const file = new File([], 'file.pdf', { type: 'application/pdf' });
    const match = fileAccepted(file, ['application/pdf']);
    expect(match).toEqual(true);
});

it('Single different accept', () => {
    const file = new File([], 'file.pdf', { type: 'application/pdf' });
    const match = fileAccepted(file, ['image/png']);
    expect(match).toEqual(false);
});

it('Multi accept including correct', () => {
    const file = new File([], 'file.pdf', { type: 'application/pdf' });
    const match = fileAccepted(file, ['image/png', 'application/pdf']);
    expect(match).toEqual(true);
});

it('Multi accept not including correct', () => {
    const file = new File([], 'file.pdf', { type: 'application/pdf' });
    const match = fileAccepted(file, ['image/png', 'image/jpg']);
    expect(match).toEqual(false);
});

it('Wildcard with match', () => {
    const file = new File([], 'file.png', { type: 'image/png' });
    const match = fileAccepted(file, ['image/*']);
    expect(match).toEqual(true);
});

it('Wildcard without match', () => {
    const file = new File([], 'file.png', { type: 'image/png' });
    const match = fileAccepted(file, ['text/*']);
    expect(match).toEqual(false);
});

it('Multi accept including multi matches with wildcard', () => {
    const file = new File([], 'file.pdf', { type: 'application/pdf' });
    const match = fileAccepted(file, ['image/png','application/pdf', 'application/*']);
    expect(match).toEqual(true);
});