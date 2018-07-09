from rest_framework import serializers
from django.core.urlresolvers import reverse


class ParentTransactionSerializer(serializers.Serializer):
    def to_representation(self, obj):
        account = obj.participation.account
        return {
            "id": obj.id,
            "date": obj.date.date().isoformat(),
            "summ": float(obj.debit - obj.credit),
            "parts": obj.participation.parts,
            "type": obj.type,
            "account": {
                "id": account.id,
                "name": account.user.username,
                "link": reverse('api-account-detail', kwargs={'pk': account.id}),
            },
        }


class TransactionReadViewSerializer(serializers.Serializer):
    """ ReadOnly serializer for frontend views."""
    def to_representation(self, obj):
        event = obj.participation.event
        account = obj.participation.account
        return {
            "id": obj.id,
            "type": obj.type_view(),
            "date": obj.date.date().isoformat(),
            "summ": float(obj.debit - obj.credit),
            "parent": ParentTransactionSerializer(obj.parent).data,
            "account": {
                "id": account.id,
                "name": account.user.username,
                "link": reverse('api-account-detail', kwargs={'pk': account.id}),
            },
            "event": {
                "id": event.id,
                "name": event.name,
                "link": reverse('api-event-detail', kwargs={'pk': event.id}),
            },
            "parts": obj.participation.parts,
        }
