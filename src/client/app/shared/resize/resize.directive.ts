import {AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy, Renderer2} from '@angular/core';

@Directive({
  selector: '[resize]',
  exportAs: 'resize'
})
export class ResizeDirective implements AfterViewInit, OnDestroy {

  @Input('resizeDisabled')
  public disabled: boolean = false;

  private container: HTMLDivElement;
  private resizeHandle: HTMLDivElement;
  private eventListeners: Function[];

  constructor(private element: ElementRef,
              private renderer: Renderer2,
              private zone: NgZone) {
  }

  public ngAfterViewInit(): void {
    this.container = this.element.nativeElement.parentElement;
    this.createHandle();
  }

  private createHandle(): void {
    let self = this;
    self.resizeHandle = document.createElement('div');
    self.resizeHandle.className = 'resize-handle';
    self.container.appendChild(self.resizeHandle);
    self.addEventListeners();
  }

  private addEventListeners(): void {
    let self = this;

    let state: { active?: boolean, handleOffset?: { x: any, y: any } } = {};
    let container = self.container;
    let element = self.element.nativeElement;
    let resizeHandle = this.resizeHandle;

    this.zone.runOutsideAngular(() => {
      let mouseDown = self.renderer.listen(self.resizeHandle, "mousedown", (event: MouseEvent) => {
        if (!self.disabled) {
          state.active = true;
        }
        document.documentElement.style.cursor = 'nw-resize';
        resizeHandle.classList.add('_active');

        let elementDimensions = element.getBoundingClientRect();
        state.handleOffset = {
          x: elementDimensions.right - event.clientX,
          y: elementDimensions.bottom - event.clientY
        };

        event.preventDefault();
      });

      let mouseUp = self.renderer.listen(document, "mouseup", () => {
        state.active = false;
        document.documentElement.style.cursor = 'inherit';
        resizeHandle.classList.remove('_active');
      });

      let mouseMove = self.renderer.listen(document, "mousemove", (event: MouseEvent) => {
        if (state.active) {
          let elementDimensions = element.getBoundingClientRect();

          // let width = event.clientX - elementDimensions.left + state.handleOffset.x + "px";
          let height = event.clientY - elementDimensions.top + state.handleOffset.y + "px";

          // element.style.width = width;
          element.style.height = height;
          // container.style.width = width;
          container.style.height = height;
        }
      });

      self.eventListeners = [mouseUp, mouseDown, mouseMove];
    });
  }

  private removeEventListeners(): void {
    if (this.eventListeners) {
      this.eventListeners.forEach((callback: Function) => {
        callback();
      })
    }
  }

  public ngOnDestroy(): void {
    this.removeEventListeners();
  }
}
