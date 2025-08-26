// src/store/__tests__/navigationBar.spec.js

import { describe, beforeEach, it, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNavigationBarStore } from '../navigationBar'

describe('Navigation Bar Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with correct default state', () => {
    const store = useNavigationBarStore()
    expect(store.panelTitle).toBeNull()
    expect(store.panelIcon).toBeNull()
    expect(store.isCollapsed).toBe(true)
    expect(store.visibleScrolling).toBe(false)
    expect(store.navigationElements).toHaveLength(4)
    expect(store.navigationElements[0].title).toBe('Settings')
    expect(store.navigationElements[1].title).toBe('Filter')
    expect(store.navigationElements[2].title).toBe('Statistics')
    expect(store.navigationElements[3].title).toBe('Analysis')
  })

  describe('getters', () => {
    it('getPanelTitle returns current panel title', () => {
      const store = useNavigationBarStore()
      store.panelTitle = 'Test Title'
      expect(store.getPanelTitle()).toBe('Test Title')
    })

    it('getPanelIcon returns current panel icon', () => {
      const store = useNavigationBarStore()
      const testIcon = '<svg>test</svg>'
      store.panelIcon = testIcon
      expect(store.getPanelIcon()).toBe(testIcon)
    })
  })

  describe('actions', () => {
    it('toggleIsCollapsed toggles the collapsed state', () => {
      const store = useNavigationBarStore()
      expect(store.isCollapsed).toBe(true)

      store.toggleIsCollapsed()
      expect(store.isCollapsed).toBe(false)

      store.toggleIsCollapsed()
      expect(store.isCollapsed).toBe(true)
    })

    it('setPanelTitle sets the panel title', () => {
      const store = useNavigationBarStore()
      const testTitle = 'New Title'

      store.setPanelTitle(testTitle)
      expect(store.panelTitle).toBe(testTitle)
      expect(store.getPanelTitle()).toBe(testTitle)
    })

    it('setPanelIcon sets the panel icon', () => {
      const store = useNavigationBarStore()
      const testIcon = '<svg>new icon</svg>'

      store.setPanelIcon(testIcon)
      expect(store.panelIcon).toBe(testIcon)
      expect(store.getPanelIcon()).toBe(testIcon)
    })

    it('toggleVisibleScrolling toggles the scrolling visibility', () => {
      const store = useNavigationBarStore()
      expect(store.visibleScrolling).toBe(false)

      store.toggleVisibleScrolling()
      expect(store.visibleScrolling).toBe(true)

      store.toggleVisibleScrolling()
      expect(store.visibleScrolling).toBe(false)
    })
  })

  describe('navigation elements', () => {
    it('contains correct SVG elements for each navigation item', () => {
      const store = useNavigationBarStore()

      store.navigationElements.forEach((element) => {
        expect(element.svgElement).toContain('<svg')
        expect(element.svgElement).toContain('</svg>')
        expect(element.svgElement).toContain('xmlns="http://www.w3.org/2000/svg"')
        expect(element.svgElement).toContain('width="16"')
        expect(element.svgElement).toContain('height="16"')
      })
    })

    it('navigation elements have correct titles and icons', () => {
      const store = useNavigationBarStore()
      const expectedTitles = ['Settings', 'Filter', 'Statistics', 'Analysis']
      const expectedIconClasses = ['bi-gear', 'bi-funnel', 'bi-bar-chart', 'bi-clipboard2-pulse']

      store.navigationElements.forEach((element, index) => {
        expect(element.title).toBe(expectedTitles[index])
        expect(element.svgElement).toContain(`class="bi ${expectedIconClasses[index]}"`)
      })
    })
  })
})
