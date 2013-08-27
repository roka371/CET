from django import template

register = template.Library()

@register.filter
def get_item(l, key):
    return l[key]