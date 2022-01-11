import {Component, h, Prop} from '@stencil/core';
import {LiteralExpression, SyntaxNames} from "../../models";
import {NodeInputContext} from "../../services/node-input-driver";
import {getInputPropertyValue} from "../../utils";
import {ExpressionChangedArs} from "../designer/input-control-switch/input-control-switch";

@Component({
  tag: 'elsa-single-line-input',
  shadow: false
})
export class SingleLineInput {
  @Prop() public inputContext: NodeInputContext;

  public render() {
    const inputContext = this.inputContext;
    const inputDescriptor = inputContext.inputDescriptor;
    const fieldName = inputDescriptor.name;
    const fieldId = inputDescriptor.name;
    const displayName = inputDescriptor.displayName;
    const hint = inputDescriptor.description;
    const input = getInputPropertyValue(inputContext);
    const value = (input?.expression as LiteralExpression)?.value; // TODO: The "value" field is currently hardcoded, but we should be able to be more flexible and potentially have different fields for a given syntax.
    const syntax = input?.expression?.type ?? inputDescriptor.defaultSyntax;
    const supportedSyntaxes = ['JavaScript', 'Liquid'];

    return (
      <elsa-input-control-switch label={displayName} hint={hint} supportedSyntaxes={supportedSyntaxes} syntax={syntax} expression={value} onExpressionChanged={this.onExpressionChanged}>
        <input type="text" name={fieldName} id={fieldId} value={value} onChange={this.onPropertyEditorChanged}/>
      </elsa-input-control-switch>
    );
  }

  private onPropertyEditorChanged = (e: Event) => {
    const inputElement = e.target as HTMLInputElement;
    this.inputContext.inputChanged(inputElement.value, SyntaxNames.Literal);
  }

  private onExpressionChanged = (e: CustomEvent<ExpressionChangedArs>) => {
    this.inputContext.inputChanged(e.detail.expression, e.detail.syntax);
  }
}
