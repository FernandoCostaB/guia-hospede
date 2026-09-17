import { describe, it, expect } from 'vitest'

// Extracted from chat-widget.tsx — test the message text extraction logic
function getMessageText(message: { parts?: Array<{ type: string; text?: string }>; content?: string }): string {
  if (message.parts) {
    return message.parts
      .filter((p): p is { type: string; text: string } => p.type === 'text' && !!p.text)
      .map((p) => p.text)
      .join('')
  }
  return message.content || ''
}

describe('getMessageText', () => {
  it('extracts text from parts array', () => {
    const msg = { parts: [{ type: 'text', text: 'Hello' }] }
    expect(getMessageText(msg)).toBe('Hello')
  })

  it('joins multiple text parts', () => {
    const msg = {
      parts: [
        { type: 'text', text: 'Hello ' },
        { type: 'text', text: 'world' },
      ],
    }
    expect(getMessageText(msg)).toBe('Hello world')
  })

  it('ignores non-text parts', () => {
    const msg = {
      parts: [
        { type: 'text', text: 'Hello' },
        { type: 'tool-invocation' },
        { type: 'text', text: ' world' },
      ],
    }
    expect(getMessageText(msg)).toBe('Hello world')
  })

  it('ignores parts with empty text', () => {
    const msg = {
      parts: [
        { type: 'text', text: '' },
        { type: 'text', text: 'Hello' },
      ],
    }
    expect(getMessageText(msg)).toBe('Hello')
  })

  it('falls back to content string', () => {
    const msg = { content: 'Legacy message' }
    expect(getMessageText(msg)).toBe('Legacy message')
  })

  it('returns empty string when no parts or content', () => {
    expect(getMessageText({})).toBe('')
  })

  it('prefers parts over content', () => {
    const msg = {
      parts: [{ type: 'text', text: 'From parts' }],
      content: 'From content',
    }
    expect(getMessageText(msg)).toBe('From parts')
  })
})
