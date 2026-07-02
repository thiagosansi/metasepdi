Feature: OKR Management

  Scenario: Create an OKR cycle
    Given I want to create a cycle named "Q3 2026"
    When the cycle start date is "2026-07-01" and end date is "2026-09-30"
    Then the cycle is created successfully with status "ACTIVE"

  Scenario: Reject invalid cycle dates
    Given I want to create a cycle named "Invalid Cycle"
    When the cycle start date is "2026-09-30" and end date is "2026-07-01"
    Then the creation fails with "data de fim deve ser posterior"

  Scenario: Calculate key result progress
    Given a key result with start 0, target 100, and current value 70
    Then the progress is 70 percent and status is "ON_TRACK"

  Scenario: Key result is AT_RISK when progress is below 70 percent
    Given a key result with start 0, target 100, and current value 50
    Then the progress is 50 percent and status is "AT_RISK"

  Scenario: Key result is BEHIND when progress is below 40 percent
    Given a key result with start 0, target 100, and current value 30
    Then the progress is 30 percent and status is "BEHIND"
