# Codestyle scss&css:

### _0 (zero) we write without units:_

- **Bad**:

```
margin: 0px auto;
width: 0%;
box-shadow: 0px 0px 10px rgb(255, 40, 30);
```

- **Good**:

```
margin: 0 auto;
width: 0;
box-shadow: 0 0 10px rgb(255, 40, 30);
```

### _Block decoration:_

1. wrap selectors to a new line,
2. indentation of the bracket from the selector in one space,
3. colon one space from a colon,
4. everything inside the block is indented by 1 tab = 2 spaces.

- **Bad**:

```
.h1, h2, h3{
margin:0 8px 24px;
padding:0px 16px;
font-size:14px;
}
```

- **Good**:

```
.h1,
h2,
h3 {
	margin: 0 8px 24px;
	padding: 0 16px;
	font-size: 14px;
}
```

### _Indentation:_

1. between blocks - 1 line space,
2. indent from styles to next selector (scss) - 1 line space,
3. everything inside the block is located on the same level,

```
.btns {
	position: relative;
	margin: -8px;
	display: inline-flex;
	flex-wrap: wrap;

    &-fixed {
        margin: 0 -24px -32px;
        padding: 16px 24px;
        width: calc(100% + 48px);
        border-top: 1px solid $border-color;
        z-index: 80;

        &.btns-sticky {
            position: fixed;
            left: 34px;
            right: 34px;
            bottom: 34px;
        }
    }

    .btn {
        margin: 8px;
    }
}
```

### _The order of writing styles within a block:_

1. position (+top, right, bottom, left ),
2. overflow: hidden;
3. margin, padding,
4. display and all thing about it,
5. background
6. border
7. font and all thing about it,
8. other styles,
9. z-index,
10. cursor,
11. transform,
12. transition

```
.selector {
	position: relative;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	overflow: hidden;
	margin: 0 auto;
	padding: 8px 24px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	flex: 1 0 300px;
	background: url("../img/btn_close.png") no-repeat scroll top 4px right 10px rgba(0, 0, 0, 0.5);
	border-bottom: 1px solid $color-general;
	border-radius: 4px;
	font-family: 'Arial', sans-serif;
	color: #000;
	font-size: 12px;
	line-height: 1;
	font-weight: 400;
	text-decoration: none;
	box-shadow: inset 0 2px 6px 0 rgba(54, 54, 54, 0.04);
	z-index: 0;
	cursor: pointer;
	transform: scale(0.8);
	transition: transform 0.2s ease-in-out;
}
```

1. Always use **single quotes**!
2. If **display: none;** – rule going to top!
3. **content: ‘ ’;** – rule going to top with single quotes.

```
.btn-close:before {
	display: none;
	content: '';
	position: absolute;
	top: 8px;
	right: 8px;
}
```

### _Variables SCSS:_

Move the variables out and save them in the file \_variables.scss

Composing logical blocks with one line space.

Variable declaration: **$entity-uniqueName**

```
$color-primary: #0099ff;
$color-danger: red;
// equal pairs in hex color reduce
$background-white: #fff;
```

Using variables:

```
h1 { color: $color-primary; }
```

### _Grouping styles by file scss:_

The styles are written and saved in the src folder with the name of the class (the name of the scss file is the same as the main class of the block to which these styles belong).

Everything in separate scss files:

```
\_header.scss
\_footer.scss
\_form.scss
```

all of the above files for compilation are collected in a separate file: **global.scss**

```
@import "variables";
@import "header";
@import "footer";
@import "form";
```

And it compiles to ** global.css ** which is in the folder ...
