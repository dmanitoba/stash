import {
  CriterionModifier,
  GenderCriterionInput,
  GenderEnum,
} from "src/core/generated-graphql";
import { genderStrings, stringToGender } from "src/utils/gender";
import {
  ModifierCriterionOption,
  ISavedCriterion,
  MultiStringCriterion,
} from "./criterion";

// Scene-level equivalent of GenderCriterionOption (criteria/gender.ts).
// Kept as a separate option/type ("performer_gender") rather than reusing
// "gender" because ModifierCriterion.applyToCriterionInput writes itself
// into the outgoing filter under criterionOption.type - scenes filter on
// SceneFilterType.performer_gender, not PerformerFilterType.gender.
export const PerformerGenderCriterionOption = new ModifierCriterionOption({
  messageID: "performer_gender",
  type: "performer_gender",
  options: genderStrings,
  modifierOptions: [
    CriterionModifier.Includes,
    CriterionModifier.Excludes,
    CriterionModifier.IsNull,
    CriterionModifier.NotNull,
  ],
  defaultModifier: CriterionModifier.Includes,
  makeCriterion: () => new PerformerGenderCriterion(),
});

export class PerformerGenderCriterion extends MultiStringCriterion {
  constructor(value: string[] = []) {
    super(PerformerGenderCriterionOption, value);
  }

  public toCriterionInput(): GenderCriterionInput {
    const value = this.value.map((v) => stringToGender(v)) as GenderEnum[];

    return {
      value_list: value,
      modifier: this.modifier,
    };
  }

  public setFromSavedCriterion(criterion: ISavedCriterion<string[]>) {
    // backwards compatibility - if the value is a string, convert it to an array
    if (typeof criterion.value === "string") {
      criterion = {
        ...criterion,
        value: [criterion.value],
      };
    }

    super.setFromSavedCriterion(criterion);
  }
}
