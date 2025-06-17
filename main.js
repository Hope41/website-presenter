'use strict'

const VP_CURSOR_SIZE = 100
const VP_CURSOR_OFT_X = 20
const VP_CURSOR_OFT_Y = 30
const VP_CURSOR_OFT_A = 2

const VP_PRESS_SHARP = .1
const VP_MOVE_SHARP = .05
const VP_ANG_SHARP = .05

const VP_ANCHOR_SCROLL_SHARP = .05

const VP_SCROLL_FORCE = .8
const VP_SCROLL_MOMENTUM = .99

const VP_MOUSE = {x: 0, y: 0, lastX: 0, lastY: 0}
const VP_CURSOR = {x: 0, y: 0, a: 0, lastA: 0, pressed: false, pressAmt: 1}

// -- Format page --
document.documentElement.style.scrollBehavior = 'auto'

// -- Create cursor --
const VP_SVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
VP_SVG.setAttribute('viewBox', '-1.5 -1.5 10.3 13')

VP_SVG.style = `
position: fixed;
top: 0;
left: 0;
width: ${VP_CURSOR_SIZE}px;
z-index: 1000;
pointer-events: none;
transform-origin: ${VP_CURSOR_OFT_X}px ${VP_CURSOR_OFT_Y}px;
filter: drop-shadow(0 0 100px #fff)
`

// Create path element
function VP_PATH() {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', 'M 0 0 L 0 10 L 3 7 L 7.3 7 Z')
    path.setAttribute('stroke', '#000')
    path.setAttribute('stroke-width', '1.5')
    path.setAttribute('fill', '#fff')
    path.setAttribute('stroke-linecap', 'round')
    path.setAttribute('stroke-linejoin', 'round')

    VP_SVG.appendChild(path)
}

VP_PATH()

document.body.appendChild(VP_SVG)

// -- Animate cursor --
addEventListener('mousemove', e => {
    VP_MOUSE.lastX = VP_MOUSE.x
    VP_MOUSE.lastY = VP_MOUSE.y

    VP_MOUSE.x = e.clientX - VP_CURSOR_OFT_X
    VP_MOUSE.y = e.clientY - VP_CURSOR_OFT_Y
})

addEventListener('mousedown', e => {
    VP_CURSOR.pressed = 50
    VP_CURSOR.pressAmt = 40
})

addEventListener('mouseup', e => {
    VP_CURSOR.pressed = 0
})

function VP_UPDATE() {
    const dx = VP_MOUSE.x - VP_CURSOR.x
    const dy = VP_MOUSE.y - VP_CURSOR.y

    // -- Press cursor --
    VP_CURSOR.pressAmt += (VP_CURSOR.pressed - VP_CURSOR.pressAmt) * VP_PRESS_SHARP

    // -- Move cursor --
    VP_CURSOR.x += dx * VP_MOVE_SHARP
    VP_CURSOR.y += dy * VP_MOVE_SHARP

    // -- Rotate cursor --
    const whole = Math.PI * 2
    const angle = Math.atan2(dy, dx)

    const normalizedCurrent = VP_CURSOR.a % whole
    let angleDiff = angle - normalizedCurrent
    if (angleDiff > Math.PI) angleDiff -= Math.PI * 2
    if (angleDiff < -Math.PI) angleDiff += Math.PI * 2

    const continuousTarget = VP_CURSOR.a + angleDiff

    VP_CURSOR.a += (continuousTarget - VP_CURSOR.a) * VP_ANG_SHARP

    // -- Apply cursor transforms ---
    VP_SVG.style.transform = `
        translate(${VP_CURSOR.x}px, ${VP_CURSOR.y}px)
        rotate(${VP_CURSOR.a + VP_CURSOR_OFT_A}rad)
        rotateX(${VP_CURSOR.pressAmt}deg) perspective(5px)`

    // -- Apply scroll --
    if (VP_SCROLL_GOAL != undefined) {
        const dist = VP_SCROLL_GOAL - VP_SCROLL_POS

        VP_SCROLL_POS += dist * VP_ANCHOR_SCROLL_SHARP
        VP_SCROLL_SPEED = 0

        if (Math.abs(dist) < 20) VP_SCROLL_GOAL = undefined
    }
    else {
        VP_SCROLL_SPEED *= VP_SCROLL_MOMENTUM
        VP_SCROLL_POS += VP_SCROLL_SPEED
    }

    scrollTo(0, VP_SCROLL_POS)

    requestAnimationFrame(VP_UPDATE)
}

// -- Smooth scrolling --
let VP_LAST_SCROLL_POS = scrollY
let VP_SCROLL_POS = scrollY
let VP_SCROLL_SPEED = 0
let VP_SCROLL_GOAL = undefined

addEventListener('wheel', e => {
    VP_SCROLL_SPEED = e.deltaY * VP_SCROLL_FORCE
})

// -- Move to anchor tags --
document.addEventListener('click', function(e) {
    const anchor = e.target.closest('a')
    const href = anchor.getAttribute('href')

    if (anchor && href) {
        const hash = href.startsWith('#')
        if (hash) {
            if (href == '#') VP_SCROLL_GOAL = 0
            else {
                const targetId = anchor.getAttribute('href')
                const targetElement = document.querySelector(targetId)

                if (targetElement) {
                    VP_SCROLL_GOAL = targetElement.getBoundingClientRect().top + scrollY
                }
            }
        }
    }
})

// -- Initialize --
requestAnimationFrame(VP_UPDATE)
