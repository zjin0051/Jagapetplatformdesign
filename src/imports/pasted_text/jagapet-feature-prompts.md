1. Species Search page — Epic 1 / User Story 1.1

Prompt for Figma:

Design a clean desktop web page for an aquatic pet website called JagaPet.
Create a species search page with a search bar at the top.
Users can search by common name or scientific name.
Show search results as cards with:

species thumbnail image
common name
scientific name
short risk label or care label

Include these states:

valid common name search returns matching results
valid scientific name search returns matching result
no result state shows message: “No matching species found”
no result state also suggests similar search terms

Style:

modern, calm, eco-friendly
white background with green accents
clean cards, not crowded
easy to read for general users
2. Species Profile page with warnings — Epic 1 / User Story 1.2

Prompt for Figma:

Design a species profile page for an aquatic pet website.
This page is opened after the user selects a species from search results.

The page must display:

common name
scientific name
invasive-risk status
care difficulty
basic profile details
adult size
lifespan
short species description

Add a warning section that appears clearly before or beside the main species details.

Support these cases:

if species is invasive or high ecological risk, show a visible red warning banner
if species has legal, permit, or compliance restrictions, show a compliance alert message
if species is lower risk and has no restriction, show the profile without high-risk banners

Style:

professional but friendly
clear hierarchy
warning banners should stand out strongly
suitable for Malaysian aquatic pet owners
3. Lifestyle Compatibility Screening page — Epic 3 / User Story 3.1

Prompt for Figma:

Design a “Lifestyle Compatibility Screening” page for JagaPet.
This page is a questionnaire that helps users check whether a pet suits their lifestyle.

Include form questions for:

age
free time available for pet care
available income / budget
maximum habitat size or available space
desired pet lifespan
care experience level

Include:

progress indicator at top
clear multiple-choice cards or buttons
save / continue button
editable answers for logged-in users
a link or button saying: “Don’t know your pet? Click to check”

Goal of page:
help users assess pet suitability before choosing a species

Style:

very clear and beginner-friendly
big text
not crowded
soft aquatic theme
4. Suitability Result page — Epic 3 / User Story 3.1

Prompt for Figma:

Design a result page after the user completes the lifestyle compatibility screening and enters pet information.

Create 2 possible result sections:

Suitable result:

show message that the pet is suitable
show species information again
show short care advice
include call-to-action button to view full care guide

Unsuitable result:

show message that the pet is not suitable
list clear reasons why it is unsuitable
suggest lifestyle adjustments
include a button linking to recommended pets compatible with the user’s lifestyle

Also include a fallback option:

if the user does not know the pet name, show a clear button to go to species identification

Style:

same design system as JagaPet
readable and structured
success state in green
caution state in red or orange
5. Wish List / Comparison page — Epic 3 / User Story 3.2

Prompt for Figma:

Design a comparison page for JagaPet where users compare several aquatic pet species they added to a wish list.

Include:

wish list icon in header with number badge
comparison results shown from highest suitability to lowest
species cards with:
image
species name
care difficulty
ecological risk
suitability score or ranking
trash can icon on each card to remove species

Empty state:

if no species has been added, show message: “You haven’t added any preferences”

Style:

comparison layout should be easy to scan
clean ranking design
balanced spacing
modern eco-themed website
6. Recommendation page — Epic 4 / User Story 4.1

Prompt for Figma:

Design a recommendation results page for JagaPet shown after the user completes the lifestyle compatibility screening.

The system should show at least 2 recommended species that match the user’s lifestyle.

Each recommendation card must show:

species name
thumbnail image
care difficulty
ecological risk level
one short reason for recommendation

Ranking rule:

if multiple species fit the lifestyle, lower ecological risk species should appear before higher-risk species when fit is similar

Include:

click on recommendation opens full species profile
no result state with message: “No suitable recommendation found”
no result state should suggest changing at least one quiz answer

Style:

recommendation cards should feel trustworthy and clean
make “Top match” visible
not too much text on one card
7. Species Profile with suitability explanation — Epic 4 / User Story 4.2

Prompt for Figma:

Design a species profile page section that explains why a species is suitable or not suitable for the user based on their completed lifestyle screening.

Include a “Why it fits you” section for suitable species:

suitable budget
manageable care level
appropriate space requirement

Include a “Why this may not fit you” section for less suitable species:

large adult size
high care difficulty
higher ecological risk

This explanation should appear clearly near the main species details, not hidden.

Style:

explanation boxes should be simple and visual
use icons for space, budget, care difficulty, ecological risk
keep wording short and easy to understand
8. Safer / Better-fit alternatives section inside species profile — Epic 4 / User Story 4.3

Prompt for Figma:

Design a section inside a species profile page called “Safer / Better-fit Alternatives”.

This section appears when the user has opened a species profile and there are suitable lower-risk or better-fit alternative species.

For each alternative show:

species image
species name
adult size
care difficulty
cost level
ecological risk level

Interaction:

clicking an alternative opens that species’ full profile page

Important:

this section should be on the same page as the viewed species
reduce extra navigation
make comparison easy at a glance

Style:

horizontal cards or compact comparison cards
clear labels
clean and not busy