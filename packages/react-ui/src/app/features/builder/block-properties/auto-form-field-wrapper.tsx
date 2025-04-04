import { BlockProperty } from '@openops/blocks-framework';
import {
  cn,
  FormItem,
  FormLabel,
  ReadMoreDescription,
  Toggle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@openops/components/ui';
import { Action, isNil, Trigger } from '@openops/shared';
import { t } from 'i18next';
import { SquareFunction } from 'lucide-react';
import { useContext, useEffect } from 'react';
import { ControllerRenderProps, useFormContext } from 'react-hook-form';

import { TextInputWithMentions } from './text-input-with-mentions';
import { CUSTOMIZED_INPUT_KEY, isDynamicViewToggled } from './utils';

import { ArrayFieldContext } from '@/app/features/builder/block-properties/dynamic-array/array-field-context';

type inputNameLiteral = `settings.input.${string}`;

const isInputNameLiteral = (
  inputName: string,
): inputName is inputNameLiteral => {
  return inputName.match(/settings\.input\./) !== null;
};
type AutoFormFieldWrapperProps = {
  children: React.ReactNode;
  allowDynamicValues: boolean;
  propertyName: string;
  property: BlockProperty;
  hideDescription?: boolean;
  placeBeforeLabelText?: boolean;
  disabled: boolean;
  field: ControllerRenderProps;
  inputName: `settings.input.${string}`;
};

const getInitialFieldValue = (
  fieldValue: string,
  defaultValue: any,
  isDirty: boolean,
) => {
  // field was explicitly cleared
  if (isDirty && isNil(fieldValue)) {
    return null;
  }

  return fieldValue ?? defaultValue ?? null;
};

const AutoFormFieldWrapper = ({
  placeBeforeLabelText = false,
  children,
  hideDescription,
  allowDynamicValues,
  propertyName,
  inputName,
  property,
  disabled,
  field,
}: AutoFormFieldWrapperProps) => {
  const form = useFormContext<Action | Trigger>();
  const fieldState = form.getFieldState(inputName);

  const arrayFieldContext = useContext(ArrayFieldContext);

  const dynamicViewToggled: boolean = isDynamicViewToggled(
    form,
    arrayFieldContext,
    propertyName,
    inputName,
  );

  // This `useEffect` ensures a one-time migration of the dynamic flag for non-array fields.
  // - The `arrayFieldContext` is checked to skip this logic for array fields, which use a different `dynamic flag` structure .
  // - This handles cases where `propertyName` was used instead of `inputName`.
  // TODO: Remove this migration logic once workflows are fully updated. (https://linear.app/openops/issue/OPS-573/remove-migration-logic-from-auto-form-field-wrapper)
  useEffect(() => {
    if (!arrayFieldContext && propertyName && inputName) {
      const oldCustomizedInputFlag = form.getValues(
        `${CUSTOMIZED_INPUT_KEY}${propertyName}`,
      );

      if (oldCustomizedInputFlag !== undefined) {
        setTimeout(() => {
          form.setValue(`${CUSTOMIZED_INPUT_KEY}${propertyName}`, undefined);
          form.setValue(
            `${CUSTOMIZED_INPUT_KEY}${inputName}`,
            oldCustomizedInputFlag,
            {
              shouldValidate: true,
            },
          );
        });
      }
    }
  }, [propertyName, inputName, arrayFieldContext]);

  // array fields use the dynamicViewToggled property to specify if a property is toggled
  function handleChange(isInDynamicView: boolean) {
    if (arrayFieldContext) {
      form.setValue(
        `${arrayFieldContext.inputName}.dynamicViewToggled.${propertyName}`,
        isInDynamicView,
        {
          shouldValidate: true,
        },
      );
    } else {
      // The structure has changed. Previously we store information based on `propertyName`,
      // but replaced it with `inputName`, so to avoid migrating existing workflows,
      // added logic to delete the old structure and replace it with the new one.
      // TODO: Remove the deletion once all workflows are migrated.
      form.setValue(`${CUSTOMIZED_INPUT_KEY}${propertyName}`, undefined);
      form.setValue(`${CUSTOMIZED_INPUT_KEY}${inputName}`, isInDynamicView, {
        shouldValidate: true,
      });
    }

    if (isInputNameLiteral(inputName)) {
      if (isInDynamicView) {
        const dynamicViewInitialValue = getInitialFieldValue(
          form.getValues(inputName),
          property.defaultValue,
          fieldState.isDirty,
        );
        form.setValue(inputName, dynamicViewInitialValue, {
          shouldValidate: true,
        });
      } else {
        // clear value if we go from dynamic to normal value that could be constrained (ex dropdown)
        form.setValue(inputName, null, {
          shouldValidate: true,
        });
      }
    } else {
      throw new Error(
        'inputName is not a member of step settings input, you might be using dynamic properties where you should not',
      );
    }
  }

  return (
    <FormItem className="flex flex-col gap-1">
      <FormLabel className="flex items-center gap-1">
        {placeBeforeLabelText && !dynamicViewToggled && children}
        <span>{t(property.displayName)}</span>
        {property.required && <span className="text-destructive">*</span>}
        <span className="grow"></span>
        {allowDynamicValues && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={dynamicViewToggled}
                onPressedChange={(e) => handleChange(e)}
                disabled={disabled}
              >
                <SquareFunction
                  className={cn('size-5', {
                    'text-foreground': dynamicViewToggled,
                    'text-muted-foreground': !dynamicViewToggled,
                  })}
                />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-background">
              {t('Dynamic value')}
            </TooltipContent>
          </Tooltip>
        )}
      </FormLabel>

      {dynamicViewToggled && (
        <TextInputWithMentions
          disabled={disabled}
          onChange={field.onChange}
          initialValue={field.value ?? null}
        ></TextInputWithMentions>
      )}
      {!placeBeforeLabelText && !dynamicViewToggled && <div>{children}</div>}
      {property.description && !hideDescription && (
        <ReadMoreDescription text={t(property.description)} />
      )}
    </FormItem>
  );
};

AutoFormFieldWrapper.displayName = 'AutoFormFieldWrapper';

export { AutoFormFieldWrapper };
