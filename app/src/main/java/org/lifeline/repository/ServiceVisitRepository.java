package org.lifeline.repository;

import org.lifeline.model.ServiceVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceVisitRepository extends JpaRepository<ServiceVisit, Long> {

    List<ServiceVisit> findByDonorId(Long donorId);
    

}
