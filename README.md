# Website Presenter
A smoother way to show off your websites!

## Usage
Paste this at the end of the HTML `body` element.

```
<script src="https://cdn.jsdelivr.net/gh/Hope41/website-presenter@main/main.js"></script>
```

https://github.com/user-attachments/assets/3f1e0f45-8866-4eb3-9cbe-2f3b02d9c43d

> [!NOTE]
> If you're recording as a video, be sure to disable the actual cursor.

## Configurations
``` HTML
<script>
    document.documentElement.websitePresenterData = {
        cursorTilt: true, // ------------------------ Tilt the cursor around an angle instead of rotating
        cursorRotSpeed: 2, // ----------------------- Cursor rotation responsiveness
        cursorAng: 0, // ---------------------------- Default cursor angle
        cursorSize: .7, // -------------------------- Default cursor size
        smoothScroll: .1, // ------------------------ Control scrolling on the webpage
        scrollForce: .1, // ------------------------- Speed exerted when the scroll event is fired
        scrollMomentum: .998, // -------------------- How long it takes to slow down (0 = instant, 1 = infinity)
    }
</script>
<script src="https://cdn.jsdelivr.net/gh/Hope41/website-presenter@main/main.js"></script>
```
#### To Do
- `hideOnPause`
- Different cursors (e.g. Caret, Pointer, Grab, etc.)
