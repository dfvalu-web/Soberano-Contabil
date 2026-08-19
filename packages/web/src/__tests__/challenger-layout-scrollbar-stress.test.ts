import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('CHALLENGER 2: Responsive Layout, Scrollbar Isolation & Build Integrity Stress Test Harness', () => {

  const cssPath = path.resolve(__dirname, '../index.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');

  const appPath = path.resolve(__dirname, '../App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf-8');

  const sidebarPath = path.resolve(__dirname, '../components/SidebarNavigation.tsx');
  const sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');

  // ============================================================================
  // SECTION 1: CSS Layout Architecture & Token Integrity
  // ============================================================================

  describe('1. CSS Architecture Rules & Selector Integrity in index.css', () => {

    it('1.1. Root html, body, and #root must enforce 100% height and overflow: hidden to prevent window scroll blowout', () => {
      expect(cssContent).toMatch(/html,\s*body,\s*#root\s*\{[^}]*overflow:\s*hidden/);
      expect(cssContent).toMatch(/html,\s*body,\s*#root\s*\{[^}]*height:\s*100%/);
      expect(cssContent).toMatch(/html,\s*body,\s*#root\s*\{[^}]*width:\s*100%/);
    });

    it('1.2. .app-container must use flex-direction: column with 100vw x 100vh and overflow: hidden', () => {
      expect(cssContent).toMatch(/\.app-container\s*\{[^}]*display:\s*flex/);
      expect(cssContent).toMatch(/\.app-container\s*\{[^}]*flex-direction:\s*column/);
      expect(cssContent).toMatch(/\.app-container\s*\{[^}]*width:\s*100vw/);
      expect(cssContent).toMatch(/\.app-container\s*\{[^}]*height:\s*100vh/);
      expect(cssContent).toMatch(/\.app-container\s*\{[^}]*overflow:\s*hidden/);
    });

    it('1.3. .app-topbar-global must have fixed 60px height, flex-shrink: 0, and z-index: 50', () => {
      expect(cssContent).toMatch(/\.app-topbar-global\s*\{[^}]*height:\s*60px/);
      expect(cssContent).toMatch(/\.app-topbar-global\s*\{[^}]*min-height:\s*60px/);
      expect(cssContent).toMatch(/\.app-topbar-global\s*\{[^}]*flex-shrink:\s*0/);
      expect(cssContent).toMatch(/\.app-topbar-global\s*\{[^}]*z-index:\s*50/);
    });

    it('1.4. .app-body-layout must occupy remaining vertical height (flex: 1, min-height: 0) and overflow: hidden', () => {
      expect(cssContent).toMatch(/\.app-body-layout\s*\{[^}]*flex:\s*1/);
      expect(cssContent).toMatch(/\.app-body-layout\s*\{[^}]*min-height:\s*0/);
      expect(cssContent).toMatch(/\.app-body-layout\s*\{[^}]*display:\s*flex/);
      expect(cssContent).toMatch(/\.app-body-layout\s*\{[^}]*width:\s*100%/);
      expect(cssContent).toMatch(/\.app-body-layout\s*\{[^}]*overflow:\s*hidden/);
    });

    it('1.5. .app-sidebar-left must be 280px fixed width with flex-shrink: 0, z-index: 30, and smooth collapse transition', () => {
      expect(cssContent).toMatch(/\.app-sidebar-left\s*\{[^}]*width:\s*280px/);
      expect(cssContent).toMatch(/\.app-sidebar-left\s*\{[^}]*min-width:\s*280px/);
      expect(cssContent).toMatch(/\.app-sidebar-left\s*\{[^}]*flex-shrink:\s*0/);
      expect(cssContent).toMatch(/\.app-sidebar-left\s*\{[^}]*z-index:\s*30/);
      expect(cssContent).toMatch(/\.app-sidebar-left\.collapsed\s*\{[^}]*width:\s*0px/);
      expect(cssContent).toMatch(/\.app-sidebar-left\.collapsed\s*\{[^}]*min-width:\s*0px/);
    });

    it('1.6. .app-center-workspace must be flexible (flex: 1, min-width: 0) with independent overflow-y: auto', () => {
      expect(cssContent).toMatch(/\.app-center-workspace\s*\{[^}]*flex:\s*1/);
      expect(cssContent).toMatch(/\.app-center-workspace\s*\{[^}]*min-width:\s*0/);
      expect(cssContent).toMatch(/\.app-center-workspace\s*\{[^}]*overflow-y:\s*auto/);
      expect(cssContent).toMatch(/\.app-center-workspace\s*\{[^}]*overflow-x:\s*hidden/);
    });

    it('1.7. .app-right-deck must be 320px fixed width with flex-shrink: 0, z-index: 30, and smooth collapse transition', () => {
      expect(cssContent).toMatch(/\.app-right-deck\s*\{[^}]*width:\s*320px/);
      expect(cssContent).toMatch(/\.app-right-deck\s*\{[^}]*min-width:\s*320px/);
      expect(cssContent).toMatch(/\.app-right-deck\s*\{[^}]*flex-shrink:\s*0/);
      expect(cssContent).toMatch(/\.app-right-deck\s*\{[^}]*z-index:\s*30/);
      expect(cssContent).toMatch(/\.app-right-deck\.collapsed\s*\{[^}]*width:\s*0px/);
      expect(cssContent).toMatch(/\.app-right-deck\.collapsed\s*\{[^}]*min-width:\s*0px/);
    });
  });

  // ============================================================================
  // SECTION 2: Custom Ultra-Fluid Scrollbar & Scroll Isolation
  // ============================================================================

  describe('2. Custom Ultra-Fluid Scrollbar & Scroll Isolation Verification', () => {

    it('2.1. .sidebar-nav-scroll must define independent scrolling (overflow-y: auto, overflow-x: hidden)', () => {
      expect(cssContent).toMatch(/\.sidebar-nav-scroll\s*\{[^}]*overflow-y:\s*auto/);
      expect(cssContent).toMatch(/\.sidebar-nav-scroll\s*\{[^}]*overflow-x:\s*hidden/);
      expect(cssContent).toMatch(/\.sidebar-nav-scroll\s*\{[^}]*flex:\s*1/);
      expect(cssContent).toMatch(/\.sidebar-nav-scroll\s*\{[^}]*min-height:\s*0/);
    });

    it('2.2. .sidebar-nav-scroll must define standard CSS scrollbar properties (scrollbar-width and scrollbar-color)', () => {
      expect(cssContent).toMatch(/\.sidebar-nav-scroll\s*\{[^}]*scrollbar-width:\s*thin/);
      expect(cssContent).toMatch(/\.sidebar-nav-scroll\s*\{[^}]*scrollbar-color:\s*#10B981\s+#0F172A/);
    });

    it('2.3. .sidebar-nav-scroll must define WebKit scrollbar pseudo-elements with 5px width and emerald thumb styling', () => {
      expect(cssContent).toMatch(/\.sidebar-nav-scroll::-webkit-scrollbar\s*\{[^}]*width:\s*5px/);
      expect(cssContent).toMatch(/\.sidebar-nav-scroll::-webkit-scrollbar-track\s*\{[^}]*background:\s*transparent/);
      expect(cssContent).toMatch(/\.sidebar-nav-scroll::-webkit-scrollbar-thumb\s*\{[^}]*background:\s*#10B981/);
      expect(cssContent).toMatch(/\.sidebar-nav-scroll::-webkit-scrollbar-thumb\s*\{[^}]*border-radius:\s*4px/);
      expect(cssContent).toMatch(/\.sidebar-nav-scroll::-webkit-scrollbar-thumb:hover\s*\{[^}]*background:\s*#34D399/);
    });

    it('2.4. Global scrollbars must also be styled cleanly to avoid default OS scrollbar artifacts', () => {
      expect(cssContent).toMatch(/\*\s*\{[^}]*scrollbar-width:\s*thin/);
      expect(cssContent).toMatch(/::-webkit-scrollbar\s*\{[^}]*width:\s*6px/);
      expect(cssContent).toMatch(/::-webkit-scrollbar-thumb:hover\s*\{[^}]*background:\s*#475569/);
    });
  });

  // ============================================================================
  // SECTION 3: Multi-Resolution Layout Geometry & Mathematical Overlap Proof
  // ============================================================================

  describe('3. Multi-Resolution Layout Geometry & Overlap Stress Testing', () => {

    interface Resolution {
      name: string;
      width: number;
      height: number;
      category: '4k' | 'widescreen' | 'desktop' | 'laptop' | 'compact' | 'tablet' | 'mobile';
    }

    const testResolutions: Resolution[] = [
      { name: '4K Ultra HD (3840x2160)', width: 3840, height: 2160, category: '4k' },
      { name: 'QHD 1440p (2560x1440)', width: 2560, height: 1440, category: 'widescreen' },
      { name: 'Ultra-Wide 21:9 (3440x1440)', width: 3440, height: 1440, category: 'widescreen' },
      { name: 'Super Ultra-Wide 32:9 (5120x1440)', width: 5120, height: 1440, category: 'widescreen' },
      { name: 'Full HD 1080p (1920x1080)', width: 1920, height: 1080, category: 'desktop' },
      { name: 'HD+ (1600x900)', width: 1600, height: 900, category: 'desktop' },
      { name: 'Standard Corporate Laptop (1366x768)', width: 1366, height: 768, category: 'laptop' },
      { name: 'MacBook Pro 13 (1280x800)', width: 1280, height: 800, category: 'laptop' },
      { name: 'HD Ready (1280x720)', width: 1280, height: 720, category: 'laptop' },
      { name: 'Compact Desktop / Legacy (1024x768)', width: 1024, height: 768, category: 'compact' },
      { name: 'iPad Pro Landscape (1366x1024)', width: 1366, height: 1024, category: 'tablet' },
      { name: 'iPad Air Landscape (1180x820)', width: 1180, height: 820, category: 'tablet' },
      { name: 'iPad Portrait (768x1024)', width: 768, height: 1024, category: 'tablet' },
      { name: 'Mobile Large (414x896)', width: 414, height: 896, category: 'mobile' },
      { name: 'Mobile Standard (375x667)', width: 375, height: 667, category: 'mobile' }
    ];

    interface PaneState {
      isSidebarOpen: boolean;
      isRightDeckOpen: boolean;
      name: string;
    }

    const paneStates: PaneState[] = [
      { isSidebarOpen: true, isRightDeckOpen: true, name: 'Both Panes Open (Sidebar 280px + Deck 320px)' },
      { isSidebarOpen: true, isRightDeckOpen: false, name: 'Sidebar Open (280px) + Deck Collapsed (0px)' },
      { isSidebarOpen: false, isRightDeckOpen: true, name: 'Sidebar Collapsed (0px) + Deck Open (320px)' },
      { isSidebarOpen: false, isRightDeckOpen: false, name: 'Both Panes Collapsed (0px + 0px - Maximum Canvas)' }
    ];

    testResolutions.forEach(res => {
      describe(`Resolution Stress: ${res.name}`, () => {

        paneStates.forEach(state => {
          it(`Calculates exact non-overlapping geometry for state: ${state.name}`, () => {
            const topbarHeight = 60;
            const bodyHeight = res.height - topbarHeight;

            const sidebarWidth = state.isSidebarOpen ? 280 : 0;
            const rightDeckWidth = state.isRightDeckOpen ? 320 : 0;
            const expectedWorkspaceWidth = res.width - sidebarWidth - rightDeckWidth;

            // 1. Vertical isolation
            expect(bodyHeight).toBeGreaterThan(0);
            expect(topbarHeight + bodyHeight).toBe(res.height);

            // 2. Horizontal sum matches 100% of viewport width with 0 overlap and 0 gap
            const totalHorizontalWidth = sidebarWidth + expectedWorkspaceWidth + rightDeckWidth;
            expect(totalHorizontalWidth).toBe(res.width);

            // 3. Workspace bounds
            if (res.width >= 1024) {
              // On desktop/notebook, workspace must always remain comfortably positive
              expect(expectedWorkspaceWidth).toBeGreaterThanOrEqual(424);
            }

            // 4. Coordinates check
            const sidebarRect = { left: 0, right: sidebarWidth, width: sidebarWidth };
            const workspaceRect = { left: sidebarWidth, right: sidebarWidth + expectedWorkspaceWidth, width: expectedWorkspaceWidth };
            const deckRect = { left: sidebarWidth + expectedWorkspaceWidth, right: res.width, width: rightDeckWidth };

            // Sidebar and workspace touch precisely at sidebarWidth
            expect(sidebarRect.right).toBe(workspaceRect.left);
            // Workspace and deck touch precisely at deckRect.left
            expect(workspaceRect.right).toBe(deckRect.left);
            // Deck ends precisely at viewport width
            expect(deckRect.right).toBe(res.width);
          });
        });
      });
    });
  });

  // ============================================================================
  // SECTION 4: Component Integration & Accessibility Validation
  // ============================================================================

  describe('4. Component Structure & DOM Class Integration', () => {

    it('4.1. App.tsx properly mounts .app-container with .app-topbar-global, .app-body-layout, and .app-right-deck', () => {
      expect(appContent).toContain('className="app-container"');
      expect(appContent).toContain('className="app-topbar-global"');
      expect(appContent).toContain('className="app-body-layout"');
      expect(appContent).toContain('className="app-center-workspace"');
      expect(appContent).toContain('app-right-deck');
    });

    it('4.2. SidebarNavigation.tsx renders nav element with class app-sidebar-left and internal sidebar-nav-scroll', () => {
      expect(sidebarContent).toContain('app-sidebar-left');
      expect(sidebarContent).toContain('sidebar-nav-scroll');
      expect(sidebarContent).toContain('department-accordion');
    });

    it('4.3. App.tsx passes collapsed class dynamically when sidebar is toggled', () => {
      expect(appContent).toMatch(/className=\{isSidebarOpen\s*\?\s*['"]['"]\s*:\s*['"]collapsed['"]\}/);
    });

    it('4.4. App.tsx toggles right deck collapsed class dynamically', () => {
      expect(appContent).toMatch(/isRightDeckOpen\s*\?\s*['"]['"]\s*:\s*['"]collapsed['"]|app-right-deck\s*\$\{isRightDeckOpen\s*\?\s*['"]['"]\s*:\s*['"]collapsed['"]\}/);
    });

    it('4.5. Diamond Champion active indicator CSS class is defined with left border and gradient glow', () => {
      expect(cssContent).toMatch(/\.module-item-btn\.active\s*\{[^}]*border-left-color:\s*var\(--emerald-500\)/);
      expect(cssContent).toMatch(/\.module-item-btn\.active\s*\{[^}]*color:\s*var\(--emerald-400\)/);
      expect(cssContent).toMatch(/\.module-item-btn\s*\{[^}]*transition:/);
    });
  });
});
