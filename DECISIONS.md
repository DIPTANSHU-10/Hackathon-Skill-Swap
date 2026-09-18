# Architectural & Design Decisions (SkillSwap)

**Hackathon ID:** AZIS-JD8YNU

## Track & API Implementation
* **Track Chosen:** Track 2 - Web Product (SkillSwap / Creator Economy)
* **API Implementation:** Standard RESTful API implemented for evaluator compatibility.

---

## Decision Points

### Decision Point 1 (DP1) - Rejection Handling
* **Behavior:** When a creator declines a booking request, the client sees the booking status instantly update to "Declined" on their "My Bookings" page. The client can either re-submit a request or choose another creator from the marketplace.
* **Reasoning:** Clearly communicating rejection status without removing the booking history maintains transparency for the client while keeping the user journey flowing.

### Decision Point 2 (DP2) - Double Booking Strategy
* **Behavior:** A single gig listing can accept multiple incoming booking requests in a "Pending" state. Once the creator approves a request for a specific time slot, conflicting pending requests are flagged or automatically declined.
* **Reasoning:** Allowing concurrent pending requests ensures creators do not lose potential sales if one request falls through, while enforcing single-acceptance prevents scheduling overlaps.

### Decision Point 3 (DP3) - Marketplace Discovery & Ranking
* **Behavior:** Gigs on the marketplace page default to **Newest First** sorting, with options for users to filter by **Category** or sort by **Price (Low to High)**.
* **Reasoning:** Sorting by newest listings ensures new creators get exposure on the platform, while category and price filters help buyers quickly locate relevant services.