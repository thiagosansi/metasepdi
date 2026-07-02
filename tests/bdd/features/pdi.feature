Feature: PDI Management

  Scenario: Add a manager note to a PDI
    Given a PDI exists with id "pdi-test"
    When I add a note "Ótima evolução em comunicação"
    Then the note is saved successfully

  Scenario: Reject empty manager notes
    Given a PDI exists with id "pdi-test"
    When I add a note with empty content
    Then the note is rejected with "vazia"
