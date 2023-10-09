# v1.2.1

###### [2023-03-20]

### Features

* **ADDED:** **External CSS Addon:** **Colors:** A addon with 6214 CSS variables of colors. ([`944db7e`](https://github.com/SGNetworksIndia/SGNUIKit/commit/944db7e3cc2088109dc603bce841be4e03608177))
* **ADDED:** **External Addon:** **SGNLoaders:** Use SGNLoader/SGNSpinner to show the progress status. ([`6117105`](https://github.com/SGNetworksIndia/SGNUIKit/commit/6117105220aa1f8ee6214563c2bfdace7ab7e9c9))
* **ADDED:** **Addon:** **SGNFullPage:** It will allow the user to scroll whole page. ([`d8e0a67`](https://github.com/SGNetworksIndia/SGNUIKit/commit/d8e0a67278923a70af37a8ffcf5e1997c6ea2ae2))
* **ADDED:** **Helper Function:** ****getGeolocation(event, elementToUpdate, callback): Get current geographical location of the user. ([`eb0e907`](https://github.com/SGNetworksIndia/SGNUIKit/commit/eb0e907e748de489fd9ba7b19c24a557e441cf96))
* fixup! ADDED: Utility: Grid: Grid will allow to create complex grid layout using the CSS classes: 'row, col-(sm/md/lg)-1/12'. ([`f044c34`](https://github.com/SGNetworksIndia/SGNUIKit/commit/f044c34130a7c32f5bd1ab3e98f407303411393e))
* **ADDED:** **Utility:** **Grid:** Grid will allow to create complex grid layout using the CSS classes: 'row, col-(sm/md/lg)-1/12'. ([`32842e9`](https://github.com/SGNetworksIndia/SGNUIKit/commit/32842e9d83c696de08a2ac9cf33ceef118d891c4))
* **ADDED:** **Component:** **sections:** Use sections (.banner) to define a full-width banner which stretch/shrink across different viewports. ([`99d7b9f`](https://github.com/SGNetworksIndia/SGNUIKit/commit/99d7b9f43d97d3a725246a259818d16bf5d8072b))
* **ADDED:** **Utility:** **BackgroundColors:** Added bg-* classes to add or change background color of elements easily. ([`6e8e985`](https://github.com/SGNetworksIndia/SGNUIKit/commit/6e8e9855a1c2b2b05d0c59da8138de110325b45c))
* **ADDED:** **String Function:** ****String.str_replace(search, replace, caseSensitive = true): Replace all occurrences of the search string with the replacement string. ([`b25f4d9`](https://github.com/SGNetworksIndia/SGNUIKit/commit/b25f4d9db7ca5b6ec96f171f28c3a3b33974e803))
* **ADDED:** **Component:** **Containers:** Use containers (.container(-fluid) to define a flexible & responsive padding and container for the content of a page to stretch/shrink across different
  viewports. ([`d3b4bdf`](https://github.com/SGNetworksIndia/SGNUIKit/commit/d3b4bdf1d5ab7a5f1e660fdb83bb38a606d86c75))
* **ADDED:** **Addon:** **SGNAtom:** The powerful addon to create a PWA ([`77a1383`](https://github.com/SGNetworksIndia/SGNUIKit/commit/77a1383fcd4374680386f0e3092394313df53af5))
* Merge pull request #68 ([`b13d0ef`](https://github.com/SGNetworksIndia/SGNUIKit/commit/b13d0ef5e378a09ab94a6fbb9d3c8ac32d7efbc6))

### Updates

* **UPDATED:** **** ****Version Information ([`dea621f`](https://github.com/SGNetworksIndia/SGNUIKit/commit/dea621fb76d06936bd2ef8702eafcdf76dc49e6d))
* **UPDATED:** **** ****package.json ([`25068fd`](https://github.com/SGNetworksIndia/SGNUIKit/commit/25068fdc0fba6b0ef5bdd5731f35025741003767))
* **UPDATED:** **** ****Build Config ([`cc1fdba`](https://github.com/SGNetworksIndia/SGNUIKit/commit/cc1fdba44bc904daeab624c85199873b2d250039))
* **UPDATED:** **** ****Build config ([`14f29b5`](https://github.com/SGNetworksIndia/SGNUIKit/commit/14f29b55f5c7c2332da2a99f5cd5838d98b8f48b))
* **UPDATED:** **** ****package.json ([`711c33c`](https://github.com/SGNetworksIndia/SGNUIKit/commit/711c33cd44de648c1d55d464d224a01a9322eb13))
* **UPDATED:** **** ****Build Scripts ([`690b754`](https://github.com/SGNetworksIndia/SGNUIKit/commit/690b75420299a00b0c6a502544550819e350bfa1))
* Merge pull request #67 ([`b53671c`](https://github.com/SGNetworksIndia/SGNUIKit/commit/b53671c6f9dd8b7b4b1ab4f0e66a788aa6a927e4))

### Improvements

* **IMPROVED:** **Loader:** ****Added common callback 'SUKR' | Added support to determine on/offline state. ([`f8b29f5`](https://github.com/SGNetworksIndia/SGNUIKit/commit/f8b29f58f3454fb95fde760b07ea095f08e944af))
* **IMPROVED:** **SGNForm:** **SGNInput:** Added feature: 'AutoComplete', use attribute 'sgn-input-suggestions="geolocation|http(s)://api.domain.com/suggestions|{url:'http(s)://api.domain.com/suggestions', 'resultKey':'result'}"' on 'input.form-control'
  element. ([`7527387`](https://github.com/SGNetworksIndia/SGNUIKit/commit/75273873319820273e481a5e2f3394fd24487ca0))
* **IMPROVED:** **Addon:** **SGNCodeSnippet:** Added support to create multiple tabs of different codes. ([`a45fad0`](https://github.com/SGNetworksIndia/SGNUIKit/commit/a45fad068b21581255cd1c031302ba6cd14e187b))
* **IMPROVED:** **Utility:** **Texts:** Added text-transform-* & text-align-* classes to transform & align elements easily. ([`a18acb3`](https://github.com/SGNetworksIndia/SGNUIKit/commit/a18acb3f4226a5ee286215025ae90336033df5f6))

### Fixes

* **FIXED:** **Addon:** **SGNAtom:** Issue #86: SGNFullPage is not initialized when using SGNAtom ([`37778b0`](https://github.com/SGNetworksIndia/SGNUIKit/commit/37778b094c767f6df61a935946e7d3c24a53534a))
* **FIXED:** **Addon:** **SGNFullPage:** Issue #85: Uncaught error: $pageNav is undefined in addon: SGNFullPage ([`e2722c1`](https://github.com/SGNetworksIndia/SGNUIKit/commit/e2722c10e41bda74b17be7e59438a4157aad4643))
* **FIXED:** **Themes:** ****Dark & Light: Colors were not uniform. ([`9bd233b`](https://github.com/SGNetworksIndia/SGNUIKit/commit/9bd233baa21b8f8c00bf46178cf1b26e174409a5))
* **FIXED:** **Utility:** **TextColors:** CSS variables were not set which made the colors unusable. ([`6792caa`](https://github.com/SGNetworksIndia/SGNUIKit/commit/6792caa2e261cee7197d09249f7df784104da003))
* **FIXED:** **Component:** **Buttons:** CSS pseudo-selector for DOM interaction state ':active' were missing. ([`9c604e6`](https://github.com/SGNetworksIndia/SGNUIKit/commit/9c604e66ed269c278f10cee1b3b79fd3e15986be))
* **FIXED:** **SGNForm:** **SGNSelect:** Attributes 'selected, disabled' were not working as expected. ([`6e9be43`](https://github.com/SGNetworksIndia/SGNUIKit/commit/6e9be430cc8c4e841ed9302fdfa048a994aa6572))
* **FIXED:** **SGNForms:** **SGNSelect:** SGNSelect were not working as expected while paired as a SGNInput-Prefix/Suffix. ([`e41ed75`](https://github.com/SGNetworksIndia/SGNUIKit/commit/e41ed75a2db35de1a64a9adff59f9aaeb5d201d7))
* **FIXED:** **Helper:** **DynamicEvents:** DOM Event not attached when called the DOM.on() function in a particular order. ([`f2e7510`](https://github.com/SGNetworksIndia/SGNUIKit/commit/f2e75101906c623229218c62c68f3361c90eaae6))
* **FIXED:** **SGNForms:** **Theme:** All existing colors which were using Hexadecimal or RGB color model has been converted to HSL model. ([`3b0cbc1`](https://github.com/SGNetworksIndia/SGNUIKit/commit/3b0cbc16887636b3955aa7e4ff749fba0fcd5091))
* **FIXED:** **Utility:** **Gradient:** CSS variables were not set which made the colors unusable. ([`5138b0d`](https://github.com/SGNetworksIndia/SGNUIKit/commit/5138b0d7617b80a881f68330fca84da8be142c21))
* **FIXED:** **Utility:** **Marquee:** Animation was not smooth during scrolling and vertical scroll was not working. ([`5fc578d`](https://github.com/SGNetworksIndia/SGNUIKit/commit/5fc578d12dc58b7ca9a1ffe6c93e88bdd960ed82))
* **FIXED:** **Utility:** **Colors:** CSS variables were not set properly, leading to unusable colors. ([`6bb54e9`](https://github.com/SGNetworksIndia/SGNUIKit/commit/6bb54e9523966a6d6d97b0c203b063b6544c1a67))
* **FIXED:** **** ****Integrated common DOM ready callback 'SUKR' to support dynamically loaded scripts. ([`e99235d`](https://github.com/SGNetworksIndia/SGNUIKit/commit/e99235d00312717f3f012f61c1c630df237584c1))
* **FIXED:** **Utility:** **Marquee:** Animation was not smooth during scrolling and vertical scroll was not working. ([`41d733f`](https://github.com/SGNetworksIndia/SGNUIKit/commit/41d733fdaa42c42434b7d66cc1ffa12535aa3dd2))
* **FIXED:** **SGNForms:** **SGNToggle:** Some minor bug fixes. ([`c94f518`](https://github.com/SGNetworksIndia/SGNUIKit/commit/c94f5181cf309900debeee5707037b970463c645))
* **FIXED:** **Component:** **Preloader:** Custom icon was not aligned properly. ([`25b2768`](https://github.com/SGNetworksIndia/SGNUIKit/commit/25b2768eb9285134068ed78d5a54f3f7ac2843c6))
* **FIXED:** **Component:** **Cards:** Some minor bug fixes. ([`f241a8b`](https://github.com/SGNetworksIndia/SGNUIKit/commit/f241a8be2378b85e8eab8fc82ac5bad3b6390cb9))
* Merge pull request #74 ([`ebc9c71`](https://github.com/SGNetworksIndia/SGNUIKit/commit/ebc9c71773bfce6da87f092e687c0182f6bb6105))
* **FIXED:** **Helper:** ****Some functions were failing to resolve. ([`b6afda0`](https://github.com/SGNetworksIndia/SGNUIKit/commit/b6afda00c29bcda0704265897d374d69aad3348c))
* Merge pull request #73 ([`cde20bf`](https://github.com/SGNetworksIndia/SGNUIKit/commit/cde20bfb7136936e2b17655058b1db210f6e6e8e))
* **FIXED:** **Component:** **iziToast:** Minor bug fixes. ([`f4dbdfa`](https://github.com/SGNetworksIndia/SGNUIKit/commit/f4dbdfa1d6de7684e934e75cc6cb3356f7b67c1c))
* **FIXED:** **Component:** ****SGNAtom & SGNi18n ([`cbfbc69`](https://github.com/SGNetworksIndia/SGNUIKit/commit/cbfbc69b3d3932b2aac57a8a6797cd57356a0933))
* **FIXED:** **Component:** **SGNAtom:** Not able to load some pages (especially, default page) ([`3f5d598`](https://github.com/SGNetworksIndia/SGNUIKit/commit/3f5d5984d3276e984b8d239a9ca50b249a467a65))
* **FIXED:** **Core:** **Loader:** The loader prevented the page from loading. ([`72aafc0`](https://github.com/SGNetworksIndia/SGNUIKit/commit/72aafc040b7bcf8fa5d5a66b23b2662b5ab4c749))
* **FIXED:** **** ****Minor bug fixes ([`2f22c23`](https://github.com/SGNetworksIndia/SGNUIKit/commit/2f22c23d263c6ef498073de823283d9ace34dd39))
* **FIXED:** **** ****Minor bug fixes ([`e0f5c74`](https://github.com/SGNetworksIndia/SGNUIKit/commit/e0f5c74d64470e3ef3886cff2dc4d36e709fb55b))
* Merge pull request #72 ([`49b5461`](https://github.com/SGNetworksIndia/SGNUIKit/commit/49b5461b5cf8b43dd6264ee2303a1a5e4607fe7d))
* **FIXED:** **Helper:** ****Some minor bug fixes. ([`2760193`](https://github.com/SGNetworksIndia/SGNUIKit/commit/2760193a43112aaee3b30a85a7fb983623be29fa))
* **FIXED:** **Addon:** **SGNConsole:** SGNConsole not accessible from production. ([`d6ecb2d`](https://github.com/SGNetworksIndia/SGNUIKit/commit/d6ecb2d2a7197bb625c09787061f6c0817e809bd))
* **FIXED:** **** ****Configuration script ([`ab81f7d`](https://github.com/SGNetworksIndia/SGNUIKit/commit/ab81f7d165f25fb61fa503ab9da6b578965f26da))
* Merge pull request #71 ([`f6d8ac3`](https://github.com/SGNetworksIndia/SGNUIKit/commit/f6d8ac36144e1c7e79dbe411062ec832cb134570))
* Merge pull request #69 ([`7437294`](https://github.com/SGNetworksIndia/SGNUIKit/commit/74372945f2c4a07535009cf0575c63776c5e6df1))
* Merge pull request #66 ([`16b6033`](https://github.com/SGNetworksIndia/SGNUIKit/commit/16b6033887aa0a0744dd5e3e26fafad06fb4a6a9))

# v1.1.4

###### [2023-01-05]

### Features

* Merge pull request #61 ([`690489a`](https://github.com/SGNetworksIndia/SGNUIKit/commit/690489acfb8a116f89fd64826eb9fc4a3ea2e493))
* **ADDED:** **Component:** **Windows:** Windows can be initialized using '.sgn-window' CSS class ([`f21e601`](https://github.com/SGNetworksIndia/SGNUIKit/commit/f21e601af87f41738b84feef96412cc340dbabf7))
* Merge pull request #57 ([`90f872e`](https://github.com/SGNetworksIndia/SGNUIKit/commit/90f872e695caa9b1e778bba492732b4a085fd0f2))
* **ADDED:** **Helper Function:** ****select() and $.select to select an object which is not empty from the specified array of objects. ([`2ce10d3`](https://github.com/SGNetworksIndia/SGNUIKit/commit/2ce10d3da15fed48ff682a7adb4e8ee8dacfbb81))
* **ADDED:** **** ****Release package builder script ([`5f5e607`](https://github.com/SGNetworksIndia/SGNUIKit/commit/5f5e607d1dcd056d5a5d1549adb0cdf67c84d474))
* **ADDED:** **String Function:** ****'toHtmlEntities, fromHtmlEntities' ([`0c191d2`](https://github.com/SGNetworksIndia/SGNUIKit/commit/0c191d23766696f48dffe2f6d24252b13f9252f5))
* **ADDED:** **** ****Helper function 'empty' ([`48d76c4`](https://github.com/SGNetworksIndia/SGNUIKit/commit/48d76c4df211d441dc402293d60de1b183f92f9f))
* Merge pull request #35 ([`420331d`](https://github.com/SGNetworksIndia/SGNUIKit/commit/420331d9a899e71691b11b100d27b4f41cd04200))
* Merge pull request #34 ([`3181bca`](https://github.com/SGNetworksIndia/SGNUIKit/commit/3181bcad7c25d916d0b52efc882ef666cf41869d))
* Merge pull request #33 ([`8f265b8`](https://github.com/SGNetworksIndia/SGNUIKit/commit/8f265b8de5c5a6fc18d87db1fc893a673127b77d))

### Updates

* Merge pull request #56 ([`7e0bf34`](https://github.com/SGNetworksIndia/SGNUIKit/commit/7e0bf343028c4991bc212ca1276b9ea6d02808d3))
* **UPDATED:** **** ****Build scripts ([`099a5f2`](https://github.com/SGNetworksIndia/SGNUIKit/commit/099a5f2abaeef256ebc86d67a9ce0bc198789b93))
* **UPDATED:** **** ****index.html of the demonstration page ([`f252c71`](https://github.com/SGNetworksIndia/SGNUIKit/commit/f252c71eccb1a1bd88e45e99f17d33fd6a43583e))
* **UPDATED:** **** ****utilities.css ([`7c9eca1`](https://github.com/SGNetworksIndia/SGNUIKit/commit/7c9eca115bc6d8de70ac09a01cef800c71b686cb))
* **UPDATED:** **** ****.gitignore & README.md ([`a5b05d0`](https://github.com/SGNetworksIndia/SGNUIKit/commit/a5b05d00ed8ca735121481c6c86b31944cc0248c))

### Improvements

* **IMPROVED:** **Component:** **Marquee:** Added attribute 'sgn-component="marquee"' & class '.marquee' to initialize 'Marquee Component' on a specific element. ([`478a8e6`](https://github.com/SGNetworksIndia/SGNUIKit/commit/478a8e6a0d5bf1388be85b7dc2fd6b4e2f407eec))
* Merge pull request #54 ([`82dc6b7`](https://github.com/SGNetworksIndia/SGNUIKit/commit/82dc6b79929d556b36130fac69653031d881be82))
* **IMPROVED:** **** ****SGNUIKit Loader ([`1e1f954`](https://github.com/SGNetworksIndia/SGNUIKit/commit/1e1f954c2d1cf7c7b237f9d3e7a20f48933e6318))

### Fixes

* Merge pull request #62 ([`a0e56fb`](https://github.com/SGNetworksIndia/SGNUIKit/commit/a0e56fbbfc06682d926bd1b0df6e46e9aa0f157f))
* **FIXED:** **Utility:** **Gradient:** The utility class '.custom-gradient' ([`9ceeed0`](https://github.com/SGNetworksIndia/SGNUIKit/commit/9ceeed026efeb637e0b74d360232f3e5165638c0))
* Merge pull request #60 ([`f1bea3e`](https://github.com/SGNetworksIndia/SGNUIKit/commit/f1bea3ef6e04512482aea255c9f82a8ad0e383ed))
* **FIXED:** **Component:** **Button:** Some minor bug fixes. ([`cfe2b85`](https://github.com/SGNetworksIndia/SGNUIKit/commit/cfe2b85921d2c6d704472fcfacf0d177be58804b))
* Merge pull request #59 ([`c3404c9`](https://github.com/SGNetworksIndia/SGNUIKit/commit/c3404c99200bce7a781726d3fd73ef75ec498a4e))
* **FIXED:** **Component:** ****Modal ([`cb7c6f2`](https://github.com/SGNetworksIndia/SGNUIKit/commit/cb7c6f266beabb930c294389c4bf678d3e7b0dde))
* Merge pull request #58 ([`4ee0fb2`](https://github.com/SGNetworksIndia/SGNUIKit/commit/4ee0fb2de45ffacff440e8ffecf425e6f2fe510c))
* **FIXED:** **** ****Color mismatch issue in 'Light' & 'Dark' theme. ([`f747ceb`](https://github.com/SGNetworksIndia/SGNUIKit/commit/f747ceba3133fa1985264a68e42a038c8e377ed7))
* Merge pull request #52 ([`f37d99f`](https://github.com/SGNetworksIndia/SGNUIKit/commit/f37d99fcd54418ff1cd2f5130a87584720ec04ac))
* **FIXED:** **Helper Function:** ****'empty' returning incorrect value. ([`2c80846`](https://github.com/SGNetworksIndia/SGNUIKit/commit/2c808466cb3d6c8fd520c0875870d71b41d4ccef))
* **FIXED:** **Element:** **Headings:** Some minor bug fixes ([`a03739a`](https://github.com/SGNetworksIndia/SGNUIKit/commit/a03739aa9c87eaf1b0ffcdad34fae57ab388792e))

# v1.1.3

###### [2022-12-14]

### Features

* **ADDED:** **** ****Security Policy ([`2ec8dff`](https://github.com/SGNetworksIndia/SGNUIKit/commit/2ec8dff37516a1ea7247013d811e001d2bffcb5e))
* **ADDED:** **** ****Pull request template ([`1efda49`](https://github.com/SGNetworksIndia/SGNUIKit/commit/1efda49f70fcddfed1c12c88b2006536f942a9fd))

### Updates

* **UPDATED:** **** ****NPM Package information ([`4dc1d8d`](https://github.com/SGNetworksIndia/SGNUIKit/commit/4dc1d8d05f1d86a70151242bc5c1dc0a0fcb7579))
* **UPDATED:** **** ****README.md ([`dfbadec`](https://github.com/SGNetworksIndia/SGNUIKit/commit/dfbadeced8a104024048c51f6cc240b1ee8bd7cb))

### Fixes

* **FIXED:** **** ****Issue #19: SGNForm component select not working ([`85059ce`](https://github.com/SGNetworksIndia/SGNUIKit/commit/85059ce78d8f7fd00b5e3c013c5c10c02354fef3))
* **FIXED:** **** ****Issue #29: Add feature to position TabLinks to the bottom of the TabLayout ([`493edbf`](https://github.com/SGNetworksIndia/SGNUIKit/commit/493edbfbddeecf036fe5870617c057029e4d353d))
* **FIXED:** **** ****Sidebar overflowing marquee text on collapsed mode ([`dbe29e4`](https://github.com/SGNetworksIndia/SGNUIKit/commit/dbe29e4ca51458fbc160df333a4c0f6bffc653bd))

# v1.1.2

###### [2022-08-08]

# v1.1.1

###### [2022-07-31]

# v1.1.0

###### [2022-07-29]

# v1.0.0-beta

###### [2022-07-29]

### Features

* Initial commit ([`de45ed6`](https://github.com/SGNetworksIndia/SGNUIKit/commit/de45ed6d074501195d7e05042c8d17575eb252c3))

### Fixes

* **FIXED:** **** ****Vulnerabilities related to NPM packages ([`c056f7b`](https://github.com/SGNetworksIndia/SGNUIKit/commit/c056f7b7779130714e7d3aef62a03074457bc9cd))


