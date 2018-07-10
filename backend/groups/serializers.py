from rest_framework import serializers

from backend.models import Group, GroupParticipation, Account


class GroupParticipationSerializer(serializers.ModelSerializer):

    class Meta:
        model = GroupParticipation
        fields = ('id', 'parts', 'account')


class GroupSerializer(serializers.ModelSerializer):
    participants = GroupParticipationSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Group
        fields = ('id', 'name', 'participants')


class GroupPostSerializer(serializers.ModelSerializer):
    participants = GroupParticipationSerializer(many=True, required=False)

    def create(self, validated_data):
        participants = validated_data.pop('participants', [])
        group = Group.objects.create(name=validated_data['name'])
        for p in participants:
            gp = GroupParticipation.objects.create(**p, group_id=group.id)

        return group

    def update(self, src_group, validated_data):
        pass

    class Meta:
        model = Group
        fields = ('name', 'participants')